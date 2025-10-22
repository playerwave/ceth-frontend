// src/pages/ActivityTablePageVisitor.tsx

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableRedesign from "../../../components/Table_re";
import CustomCard from "../../../components/Card";
import { Activity } from "../../../types/activity.types";
import { GridColDef } from "@mui/x-data-grid";
import { getActivityColumns } from "../../../components/activity_column";

type Props = {
  rows1: Activity[];
};

const ActivityTablePageVisitor = ({ rows1 }: Props) => {
  const navigate = useNavigate();
  // ✅ State สำหรับประเภทที่เลือก
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // ✅ ฟังก์ชัน toggle ประเภท
  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // ✅ กรอง rows ตามประเภทที่เลือก
  const filteredRows = useMemo(() => {
    if (selectedTypes.length === 0) return rows1;
    return rows1.filter((row) => selectedTypes.includes(row.type));
  }, [rows1, selectedTypes]);

  // ✅ ฟังก์ชัน handle double-click เพื่อไปหน้า activity info
  const handleRowDoubleClick = (activity: Activity) => {
    console.log("🖱️ Double-clicked activity:", activity);
    console.log("🖱️ Navigating to:", `/activity-info-visitor/${activity.activity_id}`);
    
    try {
      navigate(`/activity-info-visitor/${activity.activity_id}`, {
        state: { 
          activity,
          id: activity.activity_id 
        }
      });
      console.log("✅ Navigation successful");
    } catch (error) {
      console.error("❌ Navigation error:", error);
    }
  };

  // ✅ สร้าง columns พร้อม options
  const activityColumns: GridColDef<Activity>[] = useMemo(
    () =>
      getActivityColumns({
        visitorStatus: true,
        enableTypeFilter: true,
        selectedTypes,
        handleTypeChange,
      }),
    [selectedTypes]
  );

  return (
    <div style={{ padding: 24 }}>
      <CustomCard height={1250} width="100%">
        <h2 className="text-2xl font-semibold mb-4">กิจกรรมสหกิจ</h2>
        <TableRedesign
          columns={activityColumns}
          rows={filteredRows}
          height={1170}
          width="100%"
          borderRadius={14}
          getRowId={(row) => row.activity_id}
          onRowDoubleClick={handleRowDoubleClick}
        />
      </CustomCard>
    </div>
  );
};

export default ActivityTablePageVisitor;