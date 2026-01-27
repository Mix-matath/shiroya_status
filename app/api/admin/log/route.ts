// app/api/admin/log/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // 🔐 server guard (เหมือนเดิม)
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  // ✅ INSERT log (Prisma / PostgreSQL)
  await prisma.adminLog.create({
    data: {
      adminId: session.user.id,
      action: body.action,
    },
  });

  return NextResponse.json({ success: true });
}
