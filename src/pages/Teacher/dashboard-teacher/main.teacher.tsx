import React, { useEffect, useState } from "react";
import SummaryActivityCard from "./components/summaryActivityCard";
import RiskStatusCard from "./components/riskStatusCard";
import { fetchAllStudents } from "../../../service/Teacher/student.service";
import { Student } from "../../../types/student.type";

type DepartmentKey = "AAI" | "SE" | "CS" | "IT";

const TeacherDashboardMain: React.FC = () => {
  const [riskData, setRiskData] = useState<Record<number, Record<DepartmentKey, { normal: number; risk: number }>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRiskData = async () => {
      try {
        console.log("📊 [Dashboard] Loading risk data...");
        setLoading(true);

        // ดึงข้อมูลนิสิตทั้งหมด
        const students = await fetchAllStudents();
        console.log(`✅ [Dashboard] Loaded ${students.length} students`);

        // สร้าง map สาขา
        const deptMap: Record<string, DepartmentKey> = {
          "AI": "AAI",
          "AAI": "AAI",
          "SE": "SE",
          "CS": "CS",
          "IT": "IT"
        };

        // แยกข้อมูลตาม grade และ department
        const dataByGrade: Record<number, Record<DepartmentKey, { normal: number; risk: number }>> = {
          1: { AAI: { normal: 0, risk: 0 }, SE: { normal: 0, risk: 0 }, CS: { normal: 0, risk: 0 }, IT: { normal: 0, risk: 0 } },
          2: { AAI: { normal: 0, risk: 0 }, SE: { normal: 0, risk: 0 }, CS: { normal: 0, risk: 0 }, IT: { normal: 0, risk: 0 } },
          3: { AAI: { normal: 0, risk: 0 }, SE: { normal: 0, risk: 0 }, CS: { normal: 0, risk: 0 }, IT: { normal: 0, risk: 0 } },
          4: { AAI: { normal: 0, risk: 0 }, SE: { normal: 0, risk: 0 }, CS: { normal: 0, risk: 0 }, IT: { normal: 0, risk: 0 } },
        };

        // นับจำนวนนิสิตแต่ละสาขาแต่ละชั้นปี
        students.forEach((student: Student) => {
          const grade = student.year || 1; // ✅ ใช้ year จาก Student type
          const deptShort = student.department?.department_short_name || ""; // ✅ ใช้ department_short_name
          const deptKey = deptMap[deptShort];
          const riskStatus = student.risk_status || "Normal"; // ✅ ใช้ risk_status

          console.log(`🔍 Student: grade=${grade}, dept=${deptShort}, risk=${riskStatus}`);

          // เช็คว่ามี grade และ department ที่ valid หรือไม่
          if (grade >= 1 && grade <= 4 && deptKey) {
            if (riskStatus === "Risk") {
              dataByGrade[grade][deptKey].risk += 1;
            } else {
              dataByGrade[grade][deptKey].normal += 1;
            }
          } else {
            console.warn(`⚠️ Invalid student data: grade=${grade}, dept=${deptShort}, deptKey=${deptKey}`);
          }
        });

        console.log("📊 [Dashboard] Risk data by grade:", dataByGrade);
        setRiskData(dataByGrade);
      } catch (error) {
        console.error("❌ [Dashboard] Error loading risk data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRiskData();
  }, []);

  return (
    <div className="font-pt-sans w-full max-w-7xl mx-auto overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6">
        {/* การ์ดข้างบน (สูงกว่า) */}
        <div className="min-h-[560px] mb-10">
          <SummaryActivityCard />
        </div>

        {/* การ์ดข้างล่าง (เตี้ยกว่า) */}
        <div className="min-h-[360px] mb-30">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <RiskStatusCard dataByGrade={riskData || undefined} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardMain;
