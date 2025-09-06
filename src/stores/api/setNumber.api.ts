// ---------------------- API Model ----------------------
export interface ApiSetNumber {
  set_number_id: number;
  name: string;
  status: string;
  assessment_id: number;

  // backend ส่งข้อมูลเสริมมาด้วย (ตอน get-all หรือ get-by-assessment)
  assessment_name?: string;
  description?: string;
  assessment_status?: string;
}
