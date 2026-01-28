/*/ app/api/.../route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { customerId, status } = await req.json();

    if (!customerId || !status) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบ" },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: {
        customerId, // 🔑 unique
      },
      data: {
        status,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE order status error:", error);

    return NextResponse.json(
      { error: "ไม่พบรายการ หรือเกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}*/
