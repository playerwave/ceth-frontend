import React from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import TableListRow from "./tableListRow";
import { getTableListColumn } from "./tableListColumn";
import { Activity } from "@/types/activity.types";

interface TableOngoingSectionProps {
  ongoingActivities: Activity[];
  loading: boolean;
  error: string | null;
}

const TableOngoingSection: React.FC<TableOngoingSectionProps> = ({
  ongoingActivities,
  loading,
  error,
}) => {
  // Debug logs
  console.log("🔍 [TableOngoingSection] Props:", {
    ongoingActivities,
    loading,
    error,
    activitiesCount: ongoingActivities?.length || 0
  });

  if (ongoingActivities && ongoingActivities.length > 0) {
    console.log("🔍 [TableOngoingSection] Activities details:", ongoingActivities.map(activity => ({
      activity_id: activity.activity_id,
      activity_name: activity.activity_name,
      activity_state: activity.activity_state
    })));
  }

  const columns = getTableListColumn({
    enableTypeFilter: false, // ไม่ต้องมี filter สำหรับ ongoing activities
    selectedTypes: [],
    handleTypeChange: () => {},
  });

  if (loading) {
    return (
      <Box className="text-center p-4">
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ mb: 1 }}>
          กำลังโหลดกิจกรรมที่กำลังดำเนินอยู่...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          กรุณารอสักครู่
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>❌ เกิดข้อผิดพลาด: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        กิจกรรมที่กำลังดำเนินอยู่ ({ongoingActivities?.length || 0} รายการ)
      </Typography>

      {!ongoingActivities || ongoingActivities.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          <p>📭 ไม่มีกิจกรรมที่กำลังดำเนินอยู่</p>
        </div>
      ) : (
        <TableListRow
          columns={columns}
          rows={ongoingActivities}
          height={420}
          width="100%"
          initialPageSize={10}
          selectedTypes={[]}
        />
      )}
    </div>
  );
};

export default TableOngoingSection;
