import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ แก้ Type เป็น Promise
) {
  try {
    const { id } = await params; // ✅ await ก่อนใช้งาน

    const logs = await prisma.orderStatusLog.findMany({
      where: {
        orderId: id,
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
    console.error("GET logs error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}