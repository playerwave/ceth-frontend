// src/pages/Teacher/assessments/list-assessment/AssessmentTablePage.tsx

import { useEffect } from "react";
import CustomCard from "../../../../components/Card"; // ตรวจสอบ path ให้ถูกต้อง
import AssessmentTable from "./components/assessment.table"; // ตรวจสอบ path ให้ถูกต้อง, อยู่ใน subfolder "components"


// ✅ เพิ่ม interface สำหรับ Props ที่ AssessmentTablePage จะรับเข้ามา
export interface AssessmentTablePageProps {
  rows: any[]; 
}
const AssessmentTablePage = ({ rows }: AssessmentTablePageProps) => {

  return (
    <div style={{ padding: 24 }}>
      <CustomCard height={600} width="100%" className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">รายการแบบประเมิน</h2>
        <AssessmentTable rows={rows} />
      </CustomCard>
    </div>
  );
};

export default AssessmentTablePage;