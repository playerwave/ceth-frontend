// src/types/api/activity.api.ts
import { ActivityFood } from "../../types/model";
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
}
