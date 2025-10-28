import { ActivityFood } from "@/types/activity-food.type";
/**
 * ปรับ interface ให้ตรงกับ shape ของ model.Activity
 */
export interface ApiActivity {
  activity_id: number;
  activity_name: string;
  presenter_company_name: string;
  type: "Soft" | "Hard";
  description: string;
  seat: number;
  recieve_hours: number;
  event_format: "Online" | "Onsite" | "Course";
  create_activity_date: string; // ISO string
  special_start_register_date: string; // ISO string
  start_register_date: string; // ISO string
  end_register_date: string; // ISO string
  start_activity_date: string; // ISO string
  end_activity_date: string; // ISO string
  image_url: string;
  activity_status: "Private" | "Public";
  activity_state:
    | "Not Start"
    | "Special Open Register"
    | "Open Register"
    | "Close Register"
    | "Start Activity"
    | "End Activity"
    | "Start Assessment"
    | "End Assessment";
  status: "Active" | "Inactive";
  last_update_activity_date: string; // ISO string
  url: string | null;
  assessment_id: number;
  room_id: number;
  start_assessment: string | null;
  end_assessment: string | null;
  activityFood: ActivityFood[];
  upload_certificate_description?: string | null;
}

// ✅ Interface สำหรับกิจกรรม Course ที่พร้อมส่ง Certificate
export interface AvailableCourseActivity {
  activity_id: number;
  activity_name: string;
  presenter_company_name: string;
  description: string;
  type: "Soft" | "Hard";
  recieve_hours: number;
  event_format: "Course";
  activity_status: "Public";
  activity_state: "Start Activity";
  start_activity_date: string;
  end_activity_date: string;
  image_url: string;
  url: string | null;
  create_activity_date: string;
  last_update_activity_date: string;
  template_description?: string; // ✅ เพิ่ม template_description
}
