import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authenticator } from "otplib";

export async function POST(req: Request) {
  try {
    const { token, secret } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!token || !secret) {
      return NextResponse.json(
        { success: false, message: "Token or Secret is missing" },
        { status: 400 },
      );
    }

    const isValid = authenticator.verify({ token, secret });

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired code" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: true, message: "2FA verified successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("2FA Verification Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
