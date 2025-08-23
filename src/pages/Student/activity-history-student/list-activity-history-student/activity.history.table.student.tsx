// src/pages/Student/activity-student/activity-history.table.student.tsx
import { useEffect, useMemo, useState } from "react";
import TableRedesign from "../../../../components/Table_re";
import CustomCard from "../../../../components/Card";
import { GridColDef } from "@mui/x-data-grid";
import { getActivityColumns } from "../../../../components/activity_column";
import { Activity } from "../../../../types/model";
import { useNavigate } from "react-router-dom";
import { useActivityStore } from "../../../../stores/Student/activity.store.student";

type Props = {
  studentId: number;
  onRowDoubleClick?: (row: Activity) => void;
};

// ...imports เหมือนเดิม

const ActivityHistoryTableStudent = ({
  studentId,
  onRowDoubleClick,
}: Props) => {
  const navigate = useNavigate();
  const endedActivities = useActivityStore((s) => s.endedActivities);
  const searchResults = useActivityStore((s) => s.searchResults);
  const fetchEndedActivities = useActivityStore((s) => s.fetchEndedActivities);

  useEffect(() => {
    if (Number.isFinite(studentId as number)) fetchEndedActivities(studentId);
  }, [studentId, fetchEndedActivities]);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const handleTypeChange = (type: string) =>
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const baseRows = useMemo(() => (searchResults ?? endedActivities ?? []) as Activity[], [searchResults, endedActivities]);

  const filteredRows = useMemo(() => {
    if (selectedTypes.length === 0) return baseRows;
    return baseRows.filter((row) => selectedTypes.includes(row.type));
  }, [baseRows, selectedTypes]);

  const activityColumns: GridColDef<Activity>[] = useMemo(
    () =>
      getActivityColumns({
        enableTypeFilter: true,
        selectedTypes,
        handleTypeChange,
      }),
    [selectedTypes]
  );

  const goDetail = (row: Activity) => {
    if (!row?.activity_id) return;
    navigate(`/activity-history-info-student/${row.activity_id}`, {
  state: { mode: "history", id: row.activity_id },
});

  };

  return (
    <div style={{ padding: 24 }}>
      <CustomCard height={730} width="1312px">
        <h2 className="text-2xl font-semibold mb-4">ประวัติกิจกรรมของฉัน</h2>
        <div className="inner-scroll" style={{ height: 650 }}>
          <TableRedesign
            initialPageSize={10}
            columns={activityColumns}
            rows={filteredRows}
            height={650}
            width="100%"
            borderRadius={14}
            // ถ้าอยาก single click ใช้ onRowClick แทนได้
            onRowDoubleClick={(rowOrParams: any) => {
              const row: Activity = rowOrParams?.row ?? rowOrParams; // ✅ normalize ตรงนี้เสมอ
              if (onRowDoubleClick) return onRowDoubleClick(row); // ✅ ส่งให้พาเรนต์แบบ "row" ชัวร์ๆ
              return goDetail(row); // ✅ ไม่งั้นลูกนำทางเอง
            }}
            getRowId={(row: Activity) => row.activity_id}
          />
        </div>
      </CustomCard>
    </div>
  );
};

export default ActivityHistoryTableStudent;
