import { useState, useEffect } from "react";
import TableListRow from "./TableListRow";
import { getTableListColumn } from "./TableListColumn";
import { Typography } from "@mui/material";
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
  const userId = user?.userId || 8;

  // 👉 โหลดข้อมูลครั้งแรก
  useEffect(() => {
    if (userId) {
      fetchEnrolledActivities(userId);
    }
  }, [userId, fetchEnrolledActivities]);

  return (
    <div>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        ลิสต์กิจกรรมของฉัน
      </Typography>

      <TableListRow
        columns={columns}
        rows={enrolledActivities}     // ✅ ใช้ข้อมูลจาก store
        height={420}
        width="100%"
        initialPageSize={10}
        selectedTypes={selectedTypes}
      />
    </div>
  );
}
