import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const res = await req.json();
    const { name, email, password } = res;

    if (!name || !email || !password) {
      return NextResponse.json(
        { err: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { err: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { err: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Validate name length
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { err: "Name must be between 2 and 100 characters long" },
        { status: 400 },
      );
    }

    // Validate email uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { err: "Email already exists" },
        { status: 400 },
      );
    }
    // harsh password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { err: err || "Internal Server Error" },
      { status: 500 },
    );
  }
}
