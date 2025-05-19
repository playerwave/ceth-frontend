// สำหรับข้อมูลที่ใช้ในการสร้างกิจกรรม (ส่งไปยัง backend)
export interface ApiActivity {
  ac_id: number;
  ac_name: string;
  assessment_id?: number | null;
  ac_company_lecturer: string;
  ac_description: string;
  ac_type: string;
  ac_room?: string | null;
  ac_seat?: number;
  ac_food?: string[] | null;
  ac_status: string;
  ac_location_type: string;
  ac_state: string;
  ac_start_register: Date | null;
  ac_end_register: Date | null;
  ac_create_date?: Date;
  ac_last_update?: Date;
  ac_registered_count?: number;
  ac_attended_count?: number;
  ac_not_attended_count?: number;
  ac_start_time?: Date | null;
  ac_end_time?: Date | null;
  ac_image_url?: string;
  ac_normal_register?: Date | null;
  ac_recieve_hours?: number | null;
  ac_start_assessment?: Date | null;
  ac_end_assessment?: Date | null;
}

// สำหรับ React Form (ใช้ใน useState)
export interface FormData {
  ac_id: number | null;
  ac_name: string;
  assessment_id?: number | null;
  ac_company_lecturer: string;
  ac_description: string;
  ac_type: string;
  ac_room?: string | null;
  ac_seat?: string | null;
  ac_food?: string[] | null;
  ac_status: string;
  ac_location_type: string;
  ac_state: string;
  ac_start_register: string | null;
  ac_end_register: string | null;
  ac_create_date?: string;
  ac_last_update?: string;
  ac_registered_count?: number;
  ac_attended_count?: number;
  ac_not_attended_count?: number;
  ac_start_time?: string | null;
  ac_end_time?: string | null;
  ac_image_url?: File | null;
  ac_normal_register?: string | null;
  ac_recieve_hours?: number | null;
  ac_start_assessment?: string | null;
  ac_end_assessment?: string | null;
}

// สำหรับ Zustand Store ที่ใช้ในการสร้างกิจกรรม
export interface CreateActivityStoreState {
  activityLoading: boolean;
  activityError: string | null;
  createActivity: (activity: ApiActivity) => Promise<void>;
}
