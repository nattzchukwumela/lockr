import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { secretKey } = await req.json();

  const session = getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!secretKey) {
    return NextResponse.json({ error: "Secret is required" }, { status: 400 });
  }

  // Delete secret from db
  const deleteSecret = await prisma.tOTPSecret.delete({
    where: {
      secret: String(secretKey),
    },
  });

  if (!deleteSecret) {
    return NextResponse.json({ error: "Secret not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Secret deleted successfully" },
    { status: 200 },
  );
}
