import { useState, useMemo } from "react";
import TableRedesign from "../../../../components/Table_re";
import CustomCard from "../../../../components/Card";
import { getActivityColumns } from "../../../../components/activity_column";
import {Activity} from "../../../../types/model"
import { useNavigate } from "react-router-dom";

type Props = {
  rows1: unknown[];
  rows2: unknown[];
};

const ActivityTablePageStuden = ({ rows1, rows2 }: Props) => {
  console.log("🔍 [DEBUG] ActivityTablePageStudent render - rows1:", rows1);
  console.log("🔍 [DEBUG] ActivityTablePageStudent render - rows2:", rows2);
  console.log("🔍 [DEBUG] rows1 length:", rows1?.length);
  console.log("🔍 [DEBUG] rows2 length:", rows2?.length);
  console.log("🔍 [DEBUG] rows1 type:", typeof rows1);
  console.log("🔍 [DEBUG] rows2 type:", typeof rows2);
  
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleDoubleClickActivity = (row: Activity) => {
    navigate(`/activity-info-student/${row.activity_id}`, {
      state: { id: row.activity_id },
    });
  }

  const filterByType = (rows: unknown[]) => {
    if (selectedTypes.length === 0) return rows;
    return rows.filter((row) => (row as { type?: string }).type && selectedTypes.includes((row as { type: string }).type));
  };

  const activityColumnsWithoutStatus = useMemo(
    () =>
      getActivityColumns({
        includeStatus: false,
        enableTypeFilter: true,
        handleTypeChange,
        selectedTypes,
      }),
    [selectedTypes],
  );

  const activityColumnsWithRecommend = useMemo(
    () =>
      getActivityColumns({
        includeStatus: false,
        enableTypeFilter: true,
        handleTypeChange,
        selectedTypes,
        includeRecommend: false,
      }),
    [selectedTypes],
  );

  return (
    <>
      {rows1.length > 0 && (
        <div style={{ padding: 16 }}>
          <CustomCard height={800} width="1313px">
            <h2 className="text-2xl font-semibold mb-4">กิจกรรมสหกิจ</h2>
            <TableRedesign
              columns={activityColumnsWithoutStatus} // ✅ ถูกต้อง
              rows={filterByType(rows1)}
              height={720}
              width="100%"
              borderRadius={14}
              onRowDoubleClick={handleDoubleClickActivity}
            />
          </CustomCard>
        </div>
      )}

      {rows2.length > 0 && (
        <div style={{ padding: 16 }}>
          <CustomCard height={800} width="100%">
            <h2 className="text-2xl font-semibold mb-4">กิจกรรมที่แนะนำ</h2>
            <TableRedesign
              columns={activityColumnsWithRecommend} // ✅ ใช้อันนี้แทน
              rows={filterByType(rows2)}
              height={720}
              width="100%"
              borderRadius={14}
              onRowDoubleClick={handleDoubleClickActivity}
            />
          </CustomCard>
        </div>
      )}
    </>
  );
};

export default ActivityTablePageStuden;
