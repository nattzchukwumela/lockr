import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authenticator } from "otplib";
import QRCode from "qrcode";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ err: "Unauthorised" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: String(session?.user.email),
    },
  });

  if (!user) {
    return NextResponse.json({ err: "User not found" }, { status: 404 });
  }

  const secret = authenticator.generateSecret();
  if (user.email === null)
    return NextResponse.json({ err: "user not found" }, { status: 400 });
  const otpauth = authenticator.keyuri(user.email, "lockr", secret);
  const qr = await QRCode.toDataURL(otpauth);

  return NextResponse.json({
    secret,
    otpauth,
    qr, // This is a base64 image string for display
  });
}
