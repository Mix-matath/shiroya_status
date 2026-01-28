// app/api/orders/[id]/logs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const logs = await prisma.orderStatusLog.findMany({
      where: {
        orderId: params.id,
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
