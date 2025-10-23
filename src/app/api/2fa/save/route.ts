import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import crypto from "crypto";

// Optional encryption (symmetric)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32 chars (e.g. from crypto.randomBytes(32))
const IV_LENGTH = 16;

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv,
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
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
        { err: "Missing required fields: accountName, name, secret" },
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

    // Use TOTPSecret model, not Account model
    const totpSecret = await prisma.tOTPSecret.create({
      data: {
        userId: user.id,
        issuer: accountName, // The service name (GitHub, Google, etc.)
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
