import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // 🔐 กำหนด admin แบบง่าย
  if (username === "admin" && password === "1234") {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
