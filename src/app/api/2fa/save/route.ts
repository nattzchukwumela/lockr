import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import crypto from "crypto";

// Symmetric encryption for TOTP secrets
const IV_LENGTH = 16;

// Parse hex key to Buffer (must be 32 bytes for AES-256)
if (!process.env.ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is not set in environment variables");
}

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

// Validate key length
if (ENCRYPTION_KEY.length !== 32) {
  throw new Error(
    `ENCRYPTION_KEY must be 32 bytes (64 hex chars). Current length: ${ENCRYPTION_KEY.length} bytes. ` +
      `Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`,
  );
}

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// You'll need this decrypt function later to read the secrets
export function decrypt(text: string): string {
  const parts = text.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = Buffer.from(parts[1], "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
    }

    const { accountName, secret } = await req.json();

    if (!accountName || !secret) {
      return NextResponse.json(
        { err: "Missing required fields: accountName, secret" },
        { status: 400 },
      );
    }

    // Get the user from database to ensure they exist
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ err: "User not found" }, { status: 404 });
    }

    // Encrypt the secret before storing
    const encryptedSecret = encrypt(secret);

    // Create TOTP secret record
    const totpSecret = await prisma.tOTPSecret.create({
      data: {
        userId: user.id,
        issuer: accountName,
        secret: encryptedSecret,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: totpSecret.id,
          issuer: totpSecret.issuer,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error saving TOTP secret:", err);
    return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
  }
}
