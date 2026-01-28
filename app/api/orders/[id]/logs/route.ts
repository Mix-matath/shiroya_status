// app/api/orders/[id]/logs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ แก้ Type เป็น Promise
) {
  try {
    const { id } = await params; // ✅ ต้อง await ก่อนใช้งาน

    const logs = await prisma.orderStatusLog.findMany({
      where: {
        orderId: id, // ใช้ id ที่ await มาแล้ว
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        oldStatus: true,
        newStatus: true,
        createdAt: true,
        admin: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET order status logs error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}