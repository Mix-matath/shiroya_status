// ✅ 1. นำเข้า prisma จากไฟล์ตั้งค่าหลักของโปรเจคแทน
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    throw new Error('⚠️ กรุณาตั้งค่า ADMIN_USERNAME และ ADMIN_PASSWORD ในไฟล์ .env ก่อนรันคำสั่งนี้');
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername }
  })

  if (existingAdmin) {
    console.log(`⚠️ แอดมินชื่อ ${adminUsername} มีอยู่ในระบบแล้ว!`)
    return
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.create({
    data: {
      username: adminUsername,
      password: hashedPassword,
      role: 'ADMIN', 
    },
  })

  console.log(`✅ สร้าง Super Admin สำเร็จ! Username: ${admin.username}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })