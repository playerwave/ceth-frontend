import React, { useState } from "react";
import { Typography } from "@mui/material";
import Loading from "../../../../components/Loading";
import { MainActivity } from "../../../../types/Student/type_main_activity_student";
import TablePendingRow from "./tablePendingRow";
import { getTablePendingColumn } from "./tablePendingColumn";

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

  // ✅ 2. กรองกิจกรรมที่มี activity_state เป็น "Start Assessment" และยังไม่ได้ทำแบบประเมิน + ตามประเภท
  const rows = enrolledActivities
    .filter((a) => a.activity_state === "Start Assessment" && !a.has_submitted_assessment)
    .filter(
      (a) => selectedTypes.length === 0 || selectedTypes.includes(a.ac_type),
    )
    .map((activity) => ({
      id: activity.ac_id,
      ac_id: activity.ac_id,
      ac_name: activity.ac_name,
      ac_company_lecturer: activity.ac_company_lecturer,
      ac_type: activity.ac_type,
      activity_state: activity.activity_state,
      ac_start_assessment: activity.ac_start_assessment,
      ac_end_assessment: activity.ac_end_assessment,
      ac_location_type: "Online", // Default value since MainActivity doesn't have location type
    }));

  // ✅ 3. เพิ่ม props เข้า columns
  const columns = getTablePendingColumn({
    enableTypeFilter: true,
    selectedTypes,
    handleTypeChange,
  });

  return ( 
    <div>
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
    </div>
  );
};

export default TablePendingEvaluation;

