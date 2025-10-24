import { CertificateBase } from "./certificate/certificate-base.type";
import { ActivityFood } from "./activity-food.type";

export interface Activity {
  activity_id: number;
  activity_name?: string | null;
  presenter_company_name?: string;
  type?: "Soft" | "Hard";
  description?: string;
  seat?: number;
  recieve_hours?: number;
  event_format?: "Online" | "Onsite" | "Course";
  create_activity_date?: Date | string;
  special_start_register_date?: Date | string | null;
  start_register_date?: Date | string | null;
  end_register_date?: Date | string | null;
  start_activity_date?: Date | string;
  end_activity_date?: Date | string;
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
  last_update_activity_date?: Date | string;
  url?: string | null;
  room_id?: number | null;
  assessment_id?: number | null;
  assessment_version_id?: number | null;
  start_assessment?: Date | string | null;
  end_assessment?: Date | string | null;
  registered_count?: number | null;
  upload_certificate_description?: string | null;
  // ✅ Certificate Base fields (One-to-One with CertificateBase)
  certificate_base_id?: number | null;
  certificateBase?: CertificateBase | null;
  // Backward compatibility
  certificate_template_url?: string | null;
  certificate_ocr_data?: any;
  certificate_image_analysis?: any;
  // ✅ Certificate-specific fields (for merged certificate activities)
  certificate_id?: number;
  verification_status?: string;
  confidence_score?: number;
  submitted_date?: Date | string;
  ocr_extracted_data?: {
    studentName?: string;
    courseName?: string;
    completionDate?: string;
    certificateId?: string;
    issuerName?: string;
  };
  // ✅ Activity Food relationship
  activityFood?: ActivityFood[]
}
