import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { secretKey } = await req.json();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!secretKey) {
      return NextResponse.json(
        { error: "Secret is required" },
        { status: 400 },
      );
    }

    // Delete secret
    const deleted = await prisma.tOTPSecret.delete({
      where: { secret: String(secretKey) },
    });

    return NextResponse.json(
      { message: "Secret deleted successfully", deleted },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      // Prisma "Record not found" error
      return NextResponse.json({ error: "Secret not found" }, { status: 404 });
    }

    console.error("Error deleting secret:", error);
    return NextResponse.json(
      { error: "Failed to delete secret. Please try again later." },
      { status: 500 },
    );
  }
}
