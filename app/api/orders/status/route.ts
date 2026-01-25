import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { customerId, status } = await req.json();

  await db.query(
    "UPDATE orders SET status = ? WHERE customer_id = ?",
    [status, customerId]
  );

  return NextResponse.json({ success: true });
}
