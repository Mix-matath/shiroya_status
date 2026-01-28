// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // ถ้าผ่านการตรวจ auth มาแล้ว ให้ไปต่อได้เลย
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // ✅ เงื่อนไขสำคัญ: ถ้าเป็นหน้า Login ให้ "ผ่านได้เลย" ไม่ต้องเช็ค Token
        // เพื่อป้องกันการ Redirect Loop
        if (pathname === "/admin/login") {
          return true;
        }

        // สำหรับหน้าอื่นๆ ใน /admin ต้องมี Token (Login แล้ว) เท่านั้น
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login", // บอก NextAuth ว่าหน้า Login อยู่ที่นี่
    },
  }
);

export const config = {
  // Matcher นี้จะดักทุกอย่างใน /admin
  // แต่เราจัดการข้อยกเว้นไว้ใน callbacks.authorized ด้านบนแล้ว
  matcher: ["/admin/:path*"],
};