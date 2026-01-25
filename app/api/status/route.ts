import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/* ⭐ บังคับไม่ให้ cache */
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { error: "กรุณากรอก Customer ID" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      "SELECT status FROM orders WHERE customer_id = ?",
      [customerId.trim()]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "ไม่พบ Customer ID นี้" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      customerId,
      status: rows[0].status,
    });
  } catch (error) {
    console.error("POST /api/status error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
