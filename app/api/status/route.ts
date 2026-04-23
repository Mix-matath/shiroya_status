import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json({ error: "กรุณาระบุรหัสลูกค้า" }, { status: 400 });
    }

    // ✅ ค้นหา Order พร้อมดึงรายการเสื้อผ้า (items) ออกมาด้วย
    const order = await prisma.order.findUnique({
      where: {
        customerId: customerId,
      },
      include: {
        items: {
          select: {
            id: true,
            itemName: true,
            status: true,
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "ไม่พบข้อมูลลูกค้า หรือยังไม่มีออเดอร์นี้" }, { status: 404 });
    }

    // ✅ ส่งรายการเสื้อผ้ากลับไปให้หน้าลูกค้า
    return NextResponse.json({ 
      customerId: order.customerId,
      customerName: order.customerName,
      items: order.items 
    });

  } catch (error) {
    console.error("Check status error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}