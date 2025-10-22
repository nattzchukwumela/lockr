import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authenticator } from "otplib";
import QRCode from "qrcode";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: String(session.user.email) },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const secret = authenticator.generateSecret();

    if (user.email === null)
      return NextResponse.json(
        { err: "Unexpected error, your email is not set" },
        { status: 400 },
      );

    const otpauth = authenticator.keyuri(user.email, "Lockr", secret);
    const qr = await QRCode.toDataURL(otpauth);

    return NextResponse.json({
      success: true,
      data: {
        secret,
        otpauth,
        qr,
      },
    });
  } catch (err) {
    console.error("2FA Setup Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
