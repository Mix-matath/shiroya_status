import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "กรุณากรอก username และ password" },
        { status: 400 }
      );
    }

    /* ตรวจ username ซ้ำ */
    const exists = await prisma.user.findUnique({
      where: { username },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Username นี้ถูกใช้แล้ว" },
        { status: 409 }
      );
    }

    /* hash password */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* สร้าง admin */
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "ADMIN", // ไม่ใส่ก็ได้ (มี default)
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/admins error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
