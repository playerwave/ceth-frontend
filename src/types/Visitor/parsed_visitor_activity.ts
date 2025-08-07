// src/types/parsed_visitor_activity.ts

// นี่คือ Type สำหรับข้อมูลกิจกรรมที่ถูก Parse มาจาก API /visitor
// มีเฉพาะ Fields ที่คุณสามารถดึงได้จากสตริง 'row' เท่านั้น
export interface ParsedVisitorActivity {
  activity_id: string; // หรือ number ถ้าคุณมั่นใจว่า ID เป็นตัวเลขเสมอและจะแปลง
  activity_name: string;
  organizer: string;
  department: string;
  description: string;
  max_participants: number;
  location_type: string;
  start_date: string; // ควรจะเป็น Date หรือ string ในรูปแบบ Date ที่ format ได้
  end_date: string; // ควรจะเป็น Date หรือ string ในรูปแบบ Date ที่ format ได้
  activity_status: string;
  activity_code: string;
  activity_state: string;
  // ถ้ามี field อื่นๆ ที่คุณได้จาก parts[6] (เช่น duration) ให้เพิ่มตรงนี้
  // duration?: number;
}
