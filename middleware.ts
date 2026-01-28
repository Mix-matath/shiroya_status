// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = { 
  /* ใช้ Negative Lookahead เพื่อยกเว้น /admin/login 
     และยกเว้นไฟล์ที่เกี่ยวกับ api/auth ไม่ให้โดน middleware ดัก
  */
  matcher: ["/admin/((?!login).*)"], 
};