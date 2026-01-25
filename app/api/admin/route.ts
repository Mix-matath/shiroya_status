import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

/* ===============================
   POST : สร้าง Admin ใหม่
   =============================== */
export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "กรุณากรอก username และ password" },
        { status: 400 }
      );
    }

    /* 1️⃣ ตรวจว่าซ้ำไหม */
    const [exists]: any = await db.query(
      "SELECT id FROM admins WHERE username = ?",
      [username]
    );

    if (exists.length > 0) {
      return NextResponse.json(
        { error: "Username นี้ถูกใช้แล้ว" },
        { status: 409 }
      );
    }

    /* 2️⃣ hash password */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* 3️⃣ insert */
    await db.query(
      "INSERT INTO admins (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/admins error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
