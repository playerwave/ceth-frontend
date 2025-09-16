export interface Activity {
  activity_id: number;
  activity_name?: string | null;
  presenter_company_name?: string;
  type?: "Soft" | "Hard";
  description?: string;
  seat?: number;
  recieve_hours?: number;
  event_format?: "Online" | "Onsite" | "Course";
  create_activity_date?: Date;
  special_start_register_date?: Date | null;
  start_register_date?: Date | null;
  end_register_date?: Date | null;
  start_activity_date?: Date;
  end_activity_date?: Date;
  image_url?: string;
  activity_status?: "Private" | "Public";
  activity_state?: 
    | "Not Start"
    | "Special Open Register"
    | "Open Register"
    | "Close Register"
    | "Start Activity"
    | "End Activity"
    | "Start Assessment"
    | "End Assessment";
  status?: "Active" | "Inactive";
  last_update_activity_date?: Date;
  url?: string | null;
  room_id?: number | null;
  assessment_id?: number | null;
  assessment_version_id?: number | null;
  start_assessment?: Date | null;
  end_assessment?: Date | null;
  registered_count?: number | null;
}
