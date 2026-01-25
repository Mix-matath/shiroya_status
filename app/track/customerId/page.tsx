import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TrackPage({
  params,
}: {
  params: { customerId: string };
}) {
  const [rows]: any = await db.query(
    "SELECT status FROM orders WHERE customer_id = ?",
    [params.customerId]
  );

  if (rows.length === 0) {
    return <p className="p-10">ไม่พบข้อมูล</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">สถานะเสื้อผ้า</h1>
      <p className="mt-4 text-lg">{rows[0].status}</p>
    </div>
  );
}
