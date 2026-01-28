// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // ให้ผ่านไปได้เลยถ้าเงื่อนไขผ่าน authorized ด้านล่างแล้ว
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // ✅ เงื่อนไขสำคัญ: ถ้าเป็นหน้า Login ให้ "ผ่านได้เลย" (return true) 
        // ไม่ต้องเช็ค Token เพื่อป้องกันการ Redirect Loop
        if (pathname === "/admin/login") {
          return true;
        }

        // สำหรับหน้าอื่นๆ ใน /admin ต้องมี Token (Login แล้ว) เท่านั้น
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