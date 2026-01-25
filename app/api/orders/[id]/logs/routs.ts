import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const [rows] = await db.query(
    `
    SELECT 
      old_status,
      new_status,
      admin_username,
      created_at
    FROM order_status_logs
    WHERE order_id = ?
    ORDER BY created_at DESC
    `,
    [params.id]
  );

  return NextResponse.json(rows);
}
