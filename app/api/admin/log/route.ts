import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  await db.query(
    "INSERT INTO admin_logs (admin_id, action) VALUES (?, ?)",
    [session.user.id, body.action]
  );

  return Response.json({ success: true });
}
