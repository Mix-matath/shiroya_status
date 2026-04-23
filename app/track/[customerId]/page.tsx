import TrackingResult from "./TrackingResult";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  // รับค่า customerId จาก URL ที่ลูกค้าพิมพ์เข้ามา
  const { customerId } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F3FA] via-white to-[#F0F7FA] p-4 md:p-8 pt-12">
      {/* ส่ง customerId ไปให้ Client Component (TrackingResult.tsx) 
        ทำการดึงข้อมูลรายชิ้นมาแสดงผล 
      */}
      <TrackingResult customerId={customerId} />
    </div>
  );
}