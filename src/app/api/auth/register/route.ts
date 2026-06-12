import connectDb from "@/lib/db";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb(); // ✅ Connect first

    const { name, email, password } = await req.json();

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { message: "Email already exists!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(user, { status: 201 });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: `Register error: ${error}` },
      { status: 500 }
    );
  }
}
