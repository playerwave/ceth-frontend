import React, { useState } from "react";
import { Typography } from "@mui/material";
import Loading from "../../../../components/Loading";
import CustomCard from "../../../../components/Card";
import TablePendingRow from "./TablePendingRow";
import { getTablePendingColumn } from "./TablePendingColumn";
import { mapTransformedActivity } from "../util/mapTransformedActivity";
import { MainActivity } from "../../../../types/Student/type_main_activity_student";

interface TablePendingEvaluationProps {
  activityLoading: boolean;
  activityError: string | null;
  enrolledActivities: MainActivity[];
  transformedActivities: any[];
}

const TablePendingEvaluation: React.FC<TablePendingEvaluationProps> = ({
  activityLoading,
  activityError,
  enrolledActivities,
}) => {
  // ✅ 1. กรองประเภทด้วย useState
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  // ✅ 2. กรองกิจกรรมที่มี activity_state เป็น "End Activity" หรือ "Start Assessment" + ตามประเภท
  const rows = enrolledActivities
    .filter((a) => a.activity_state === "End Activity" || a.activity_state === "Start Assessment")
    .filter(
      (a) => selectedTypes.length === 0 || selectedTypes.includes(a.ac_type),
    )
    .map(mapTransformedActivity);

  // ✅ 3. เพิ่ม props เข้า columns
  const columns = getTablePendingColumn({
    enableTypeFilter: true,
    selectedTypes,
    handleTypeChange,
  });

  return ( 
    <CustomCard className="mt-6 mx-auto shadow-xl" width="100%" height={600}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        ลิสต์กิจกรรมที่ยังไม่ได้ทำแบบประเมิน
      </Typography>

      {activityLoading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md z-40">
          <Loading />
        </div>
      ) : activityError ? (
        <p className="text-center text-red-500 p-4">
          ❌ เกิดข้อผิดพลาด: {activityError}
        </p>
      ) : enrolledActivities.length === 0 ? (
        <p className="text-center text-gray-500 p-4">📍 ไม่พบกิจกรรม</p>
      ) : (
        <TablePendingRow columns={columns} rows={rows} />
      )}
    </CustomCard>
  );
};

export default TablePendingEvaluation;
