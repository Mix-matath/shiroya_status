// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

/* ✅ ประกาศ global type ให้ถูกต้อง */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!, // แนะนำให้ใช้ DATABASE_URL สำหรับ runtime
});

// ใช้ (globalThis as any).prisma เพื่อเลี่ยง error "no index signature"
export const prisma =
  (globalThis as any).prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  (globalThis as any).prisma = prisma;
}

/*// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

/* ✅ บอก TypeScript ว่า globalThis มี prisma */
/*declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaNeon({
  connectionString: process.env.DIRECT_URL!,
});

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}*/
