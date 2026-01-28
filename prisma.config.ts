// prisma.config.ts
// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
    // @ts-ignore - ปิด error เนื่องจาก Type definition ของ Prisma 7 บางเวอร์ชันอาจยังไม่อัปเดต
    directUrl: process.env.DIRECT_URL!, 
  },
} as any); // หรือ cast ทั้งหมดเป็น any เพื่อให้รองรับ property ใหม่ๆ