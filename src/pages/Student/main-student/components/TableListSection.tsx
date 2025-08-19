import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Loading from "../../../../components/Loading";
import CustomCard from "../../../../components/Card";
import TableListRow from "./TableListRow";
import { getTableListColumn } from "./TableListColumn";
import { useActivityStore } from "../../../../stores/Student/activity.store.student";
import { useAuthStore } from "../../../../stores/Visitor/auth.store";

export default function TableListSection() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const columns = getTableListColumn({
    enableTypeFilter: true,
    selectedTypes,
    handleTypeChange,
  });

  // 👉 ดึงจาก store
  const {
    enrolledActivities,
    fetchEnrolledActivities,
    activityLoading,
    activityError,
  } = useActivityStore();

  const { user } = useAuthStore();
  const studentId = user?.student?.students_id || 3; // ใช้ students_id แทน userId

  console.log("🔍 [DEBUG] TableListSection - user:", user);
  console.log("🔍 [DEBUG] TableListSection - studentId:", studentId);

  // 👉 โหลดข้อมูลครั้งแรก
  useEffect(() => {
    console.log("🔍 [DEBUG] TableListSection useEffect - studentId:", studentId);
    if (studentId) {
      console.log("📞 [DEBUG] Calling fetchEnrolledActivities with studentId:", studentId);
      fetchEnrolledActivities(studentId);
    }
  }, [studentId]); // ลบ fetchEnrolledActivities ออกจาก dependency

  console.log("🔍 [DEBUG] TableListSection render - enrolledActivities:", enrolledActivities);
  console.log("🔍 [DEBUG] TableListSection render - activityLoading:", activityLoading);
  console.log("🔍 [DEBUG] TableListSection render - activityError:", activityError);

  return (
    <div>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        ลิสต์กิจกรรมของฉัน
      </Typography>

      {activityLoading ? (
        <div className="text-center p-4">
          <p>กำลังโหลดกิจกรรม...</p>
        </div>
      ) : activityError ? (
        <div className="text-center text-red-500 p-4">
          <p>❌ เกิดข้อผิดพลาด: {activityError}</p>
        </div>
      ) : !enrolledActivities || enrolledActivities.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          <p>📭 ไม่พบกิจกรรมที่ลงทะเบียน</p>
        </div>
      ) : (
        <TableListRow
          columns={columns}
          rows={enrolledActivities}     // ✅ ใช้ข้อมูลจาก store
          height={420}
          width="100%"
          initialPageSize={10}
          selectedTypes={selectedTypes}
        />
      )}
    </div>
  );
}
