export interface Certificate {
  certificate_id: number;
  students_id: number;
  teacher_id?: number;
  activity_id?: number;
  date?: Date;
  hours?: number;
  img?: string | null;
  status?: "Pending" | "Pass";
  original_filename?: string;
  file_type?: string;
  file_size?: number;
  ocr_extracted_data?: {
    studentName: string;
    courseName: string;
    completionDate: string;
    certificateId: string;
    issuerName: string;
  };
  verification_metadata?: {
    lastVerified: Date;
    verificationCount: number;
    confidenceScore: number;
    verificationStatus: string;
  };
  uploaded_at: Date;
  updated_at: Date;
  activity?: {
    activity_id: number;
    activity_name: string;
  };
}
