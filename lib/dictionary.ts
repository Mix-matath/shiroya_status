// lib/dictionary.ts

export const dictionary = {
  th: {
    // --- หน้าแรก (Home) ---
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

    // --- คำแปลสถานะ ---
    status_pending: "รอรับผ้า",
    status_processing: "กำลังซัก",
    status_ironing: "กำลังรีด",
    status_delivery: "กำลังส่ง",
    status_completed: "เสร็จสิ้น",
    status_cancelled: "ยกเลิก",

    // --- หน้าผลลัพธ์ (Tracking Result) ---
    label_customer: "ลูกค้า",
    label_order_id: "Order ID",
    label_progress: "ความคืบหน้า",
    label_last_update: "อัปเดตล่าสุด",
    label_back: "กลับหน้าหลัก",
    help_text: "หากมีข้อสงสัย โปรดติดต่อพนักงานที่หน้าร้าน",

    // --- Admin: ตารางและปุ่มลบ ---
    admin_active_title: "งานที่กำลังดำเนินการ",
    admin_history_title: "ประวัติงานที่เสร็จสิ้น",
    admin_header_id: "รหัสลูกค้า",
    admin_header_name: "ชื่อลูกค้า",
    admin_header_status: "สถานะ",
    admin_header_date: "วันที่",
    admin_header_action: "จัดการ",
    admin_btn_delete: "ลบ",
    admin_confirm_delete: "⚠️ คุณแน่ใจหรือไม่ที่จะลบออเดอร์นี้?\n(การกระทำนี้ไม่สามารถย้อนกลับได้)",
    admin_delete_success: "ลบเรียบร้อย",
    admin_delete_error: "ลบไม่สำเร็จ",
    admin_empty: "ไม่พบรายการ",
    
    // ✅ เพิ่มส่วนนี้ให้ครบ (สำคัญมาก)
    admin_dashboard_title: "แดชบอร์ดผู้ดูแลระบบ",
    admin_add_title: "เพิ่มออเดอร์ใหม่",
    admin_add_placeholder_id: "รหัสลูกค้า (เช่น 001)",
    admin_add_placeholder_name: "ชื่อลูกค้า (ไม่บังคับ)",
    admin_btn_add: "เพิ่มออเดอร์",
    admin_btn_adding: "กำลังเพิ่ม...",
    admin_add_success: "เพิ่มออเดอร์สำเร็จ!",
    admin_add_error: "เพิ่มไม่สำเร็จ (รหัสอาจซ้ำ)",
    admin_logout: "ออกจากระบบ"
  },
  en: {
    // --- Home ---
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

    // --- Status ---
    status_pending: "Pending",
    status_processing: "Processing",
    status_ironing: "Ironing",
    status_delivery: "Delivery",
    status_completed: "Completed",
    status_cancelled: "Cancelled",

    // --- Result ---
    label_customer: "Customer",
    label_order_id: "Order ID",
    label_progress: "Progress",
    label_last_update: "Last Updated",
    label_back: "Back to Home",
    help_text: "For inquiries, please contact our staff.",

    // --- Admin: Table ---
    admin_active_title: "Active Jobs",
    admin_history_title: "Completed History",
    admin_header_id: "Customer ID",
    admin_header_name: "Customer Name",
    admin_header_status: "Status",
    admin_header_date: "Date",
    admin_header_action: "Action",
    admin_btn_delete: "Delete",
    admin_confirm_delete: "⚠️ Are you sure you want to delete this order?\n(This action cannot be undone)",
    admin_delete_success: "Deleted successfully",
    admin_delete_error: "Delete failed",
    admin_empty: "No orders found",

    // ✅ เพิ่มส่วนนี้ให้ครบ (สำคัญมาก)
    admin_dashboard_title: "Admin Dashboard",
    admin_add_title: "Add New Order",
    admin_add_placeholder_id: "Customer ID (e.g. 001)",
    admin_add_placeholder_name: "Customer Name (Optional)",
    admin_btn_add: "Add Order",
    admin_btn_adding: "Adding...",
    admin_add_success: "Order added successfully!",
    admin_add_error: "Failed to add (ID might exist)",
    admin_logout: "Logout"
  }
};

export type Language = "th" | "en";