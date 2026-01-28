// proxy.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    // ฟังก์ชันนี้จะทำงานเมื่อ authorized ผ่านแล้ว
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // ✅ 1. ถ้าเป็นหน้า Login ให้ "ผ่านได้เลย" (return true) 
        // เพื่อป้องกันการ Redirect Loop ที่ทำให้เข้าหน้าเว็บไม่ได้
        if (pathname === "/admin/login") {
          return true;
        }

        // ✅ 2. สำหรับหน้าอื่นๆ ใน /admin ต้องมี Token (Login แล้ว) เท่านั้น
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  // ดักจับทุก path ใน /admin
  matcher: ["/admin/:path*"],
};