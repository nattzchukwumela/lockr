import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authenticator } from "otplib";

export async function POST(req: Request) {
  const { token, secret } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ err: "Unauthorised" }, { status: 400 });
  }

  if (!token || !secret) {
    return NextResponse.json(
      { err: "Token or Secret is missing" },
      { status: 400 },
    );
  }

  const isValid = authenticator.verify({ token, secret });

  if (!isValid) {
    return NextResponse.json(
      { err: "token or secret is not valid" },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: isValid }, { status: 200 });
}
