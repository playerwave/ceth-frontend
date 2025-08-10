// src/pages/ActivityTablePageVisitor.tsx

import { useMemo, useState } from "react";
import TableRedesign from "../../../../components/Table_re";
import CustomCard from "../../../../components/Card";
import { GridColDef } from "@mui/x-data-grid";
import { getActivityColumns } from "../../../../components/activity_column";
import { Activity } from "../../../../types/model";
import "./components/table.history.css"

type Props = {
  rows1: Activity[];
};

const ActivityHistoryTable = ({ rows1 }: Props) => {
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

  // ✅ สร้าง columns พร้อม options
  const activityColumns: GridColDef<Activity>[] = useMemo(
    () =>
      getActivityColumns({
        // visitorStatus: true,
        enableTypeFilter: true,
        selectedTypes,
        handleTypeChange,
      }),
    [selectedTypes]
  );

  return (
  <div style={{ padding: 24 }}>
  <CustomCard height={730} width="1312px">
    <h2 className="text-2xl font-semibold mb-4">รายชื่อประวัติกิจกรรมสหกิจทั้งหมด</h2>

    <div className="inner-scroll" style={{ height: 650 }}>
      <TableRedesign
        initialPageSize={10}
        columns={activityColumns}
        rows={filteredRows}
        height={650}       // ให้ตารางเองมี height (อย่า auto)
        width="100%"
        borderRadius={14}
      />
    </div>
  </CustomCard>
</div>

);

};

export default ActivityHistoryTable;


