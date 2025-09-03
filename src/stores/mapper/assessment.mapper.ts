// import { ApiAssessment } from "../api/assessment.api";
// import { Assessment } from "../../types/model";

// export function mapApiToAssessment(api: ApiAssessment): Assessment {
//   return {
//     assessment_id: api.assessment_id,
//     assessment_name: api.assessment_name,
//     description: api.description,
//     create_date: api.create_date,
//     last_update: api.last_update,
//     assessment_status: api.assessment_status,
//     set_number: api.set_number_id,
//     status: api.status,
//   };
// }

// export function mapApiToAssessments(arr: ApiAssessment[]): Assessment[] {
//   return arr.map(mapApiToAssessment);
// }


import { ApiSetNumber } from "../api/assessment.api";
import { Assessment } from "../../types/model";

export function mapApiToAssessment(api: ApiSetNumber): Assessment {
  return {
    assessment_id: api.set_number_id,         // ใช้ set_number_id แทน
    assessment_name: api.name,                // ใช้ name แทน assessment_name
    description: "",                          // API นี้ไม่มี description → ใส่ค่าว่าง
    create_date: new Date().toISOString(),    // ไม่มี field → default
    last_update: new Date().toISOString(),    // ไม่มี field → default
    assessment_status: "Not finished",        // default ไว้ (หรือจะ map จาก status ถ้าต้องการ)
    set_number: api.set_number_id,
    status: api.status === "Active" ? "Active" : "Inactive", // ✅ แปลงชัดเจน
  };
}

export function mapApiToAssessments(arr: ApiSetNumber[]): Assessment[] {
  return arr.map(mapApiToAssessment);
}
