import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/* ===============================
   GET : ดึงรายการงานทั้งหมด
   =============================== */
export async function GET() {
  try {
    /* 🔐 SERVER GUARD */
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [rows] = await db.query(
      "SELECT id, customer_id, status FROM orders ORDER BY id DESC"
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ===============================
   PUT : อัปเดตสถานะ + Audit Log
   =============================== */
export async function PUT(req: Request) {
  try {
    /* 🔐 SERVER GUARD */
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      id,
      status,
      adminId,
      adminUsername,
    } = await req.json();

    /* 🔴 ตรวจข้อมูล */
    if (!id || !status) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบ" },
        { status: 400 }
      );
    }

    /* 1️⃣ ดึงสถานะเก่า */
    const [oldRows]: any = await db.query(
      "SELECT status FROM orders WHERE id = ?",
      [id]
    );

    if (oldRows.length === 0) {
      return NextResponse.json(
        { error: "ไม่พบ Order" },
        { status: 404 }
      );
    }

    const oldStatus = oldRows[0].status;

    /* 2️⃣ อัปเดตสถานะใหม่ */
    const [result]: any = await db.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    /* 3️⃣ บันทึก Audit Log (ถ้ามี admin) */
    if (adminId && adminUsername) {
      await db.query(
        `
        INSERT INTO order_status_logs
        (order_id, old_status, new_status, admin_id, admin_username)
        VALUES (?, ?, ?, ?, ?)
        `,
        [id, oldStatus, status, adminId, adminUsername]
      );
    }

    return NextResponse.json({
      success: true,
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("PUT /api/orders error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { customer_id } = await req.json();

    if (!customer_id) {
      return NextResponse.json(
        { error: "customer_id is required" },
        { status: 400 }
      );
    }

    await db.query(
      `
      INSERT INTO orders (customer_id, status)
      VALUES (?, ?)
      `,
      [customer_id, "เราได้รับเสื้อผ้าของคุณแล้ว"]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
