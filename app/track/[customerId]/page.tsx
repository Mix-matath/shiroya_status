import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TrackPage({
  params,
}: {
  params: { customerId: string };
}) {
  const order = await prisma.order.findUnique({
    where: {
      customerId: params.customerId,
    },
    select: {
      status: true,
    },
  });

  if (!order) {
    return <p className="p-10">ไม่พบข้อมูล</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">สถานะเสื้อผ้า</h1>
      <p className="mt-4 text-lg">{order.status}</p>
    </div>
  );
}
