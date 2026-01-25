import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * ขยาย interface Session ให้รู้จัก username ใน user object
   */
  interface Session {
    user: {
      id: string 
      name?: string | null
      email?: string | null
      image?: string | null
      username?: string | null // เพิ่มบรรทัดนี้เข้าไปครับ
    }
  }

  /**
   * ถ้าคุณใช้ JWT ด้วย ควรเพิ่มตรงนี้ด้วย
   */
  interface User {
    id: string 
    username?: string | null
  }
}