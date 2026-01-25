import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import AdminClient from "./AdminClient";

export default async function AdminPage() {
  /* 🔐 SERVER GUARD (ของจริง) */
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="p-10 space-y-6">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-2xl font-bold">
          📦 จัดการสถานะงาน
        </h1>

        <p className="text-gray-600 mt-1">
          👋 สวัสดี {session.user.username}
        </p>
      </div>

      {/* ✅ CLIENT ZONE */}
      <AdminClient />
    </div>
  );
}
