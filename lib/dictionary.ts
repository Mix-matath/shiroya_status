// lib/dictionary.ts

export const dictionary = {
  th: {
    title: "ตรวจสอบสถานะ",
    subtitle: "กรอกรหัสลูกค้าเพื่อตรวจสอบสถานะเสื้อผ้า",
    placeholder: "เลขใบเสร็จ (Slip No.)",
    button_check: "ตรวจสอบสถานะ",
    button_loading: "กำลังตรวจสอบ...",
    status_label: "สถานะปัจจุบัน",
    error_empty: "กรุณากรอก Slip No",
    error_not_found: "ไม่พบข้อมูลลูกค้า หรือ รหัสไม่ถูกต้อง",
    error_connect: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
    footer: "© Shiroya Laundry Service",
    lang_switch: "Switch to English 🇬🇧",
    
    // ✅ คำแปลสถานะ (ต้องมีส่วนนี้)
    status_pending: "รอรับผ้า",
    status_processing: "กำลังซัก",
    status_ironing: "กำลังรีด",
    status_delivery: "กำลังส่ง",
    status_completed: "เสร็จสิ้น",
    status_cancelled: "ยกเลิก",
    
    // ส่วนอื่นๆ
    label_customer: "ลูกค้า",
    label_order_id: "Order ID",
    label_progress: "ความคืบหน้า",
    label_last_update: "อัปเดตล่าสุด",
    label_back: "กลับหน้าหลัก",
    help_text: "หากมีข้อสงสัย โปรดติดต่อพนักงานที่หน้าร้าน"
  },
  en: {
    title: "Check Status",
    subtitle: "Enter customer ID to track your order",
    placeholder: "Customer ID (e.g. ORDER-123)",
    button_check: "Check Status",
    button_loading: "Checking...",
    status_label: "Current Status",
    error_empty: "Please enter Customer ID",
    error_not_found: "Customer not found or invalid ID",
    error_connect: "Connection error",
    footer: "© Shiroya Laundry Service",
    lang_switch: "เปลี่ยนเป็นภาษาไทย 🇹🇭",

    // ✅ คำแปลสถานะ (ต้องมีส่วนนี้)
    status_pending: "Pending",
    status_processing: "Processing",
    status_ironing: "Ironing",
    status_delivery: "Delivery",
    status_completed: "Completed",
    status_cancelled: "Cancelled",

    // ส่วนอื่นๆ
    label_customer: "Customer",
    label_order_id: "Order ID",
    label_progress: "Progress",
    label_last_update: "Last Updated",
    label_back: "Back to Home",
    help_text: "For inquiries, please contact our staff."
  }
};

export type Language = "th" | "en";