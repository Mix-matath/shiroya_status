import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. รับค่า customerId จากหน้าบ้าน
    const body = await request.json();
    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json({ error: "กรุณาระบุรหัสลูกค้า" }, { status: 400 });
    }

    // 2. ค้นหาใน Database
    const order = await prisma.order.findUnique({
      where: {
        customerId: customerId,
      },
      select: {
        status: true,
      },
    });

    // 3. ถ้าไม่เจอ
    if (!order) {
      return NextResponse.json({ error: "ไม่พบข้อมูลลูกค้า" }, { status: 404 });
    }

    // 4. ถ้าเจอ ส่งสถานะกลับไป
    return NextResponse.json({ status: order.status });

  } catch (error) {
    console.error("Check status error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}