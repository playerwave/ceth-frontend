// ✅ ActivityTablePage.tsx
import { useState, useMemo } from "react";
import TableRedesign from "../components/table_redesign";
import CustomCard from "../components/Card";
import { getActivityColumns } from "../components/activity_column";

type Props = {
  rows1: any[];
  rows2: any[];
  rows3: any[];
};

const ActivityTablePage = ({ rows1, rows2, rows3 }: Props) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filterByType = (rows: any[]) => {
    if (selectedTypes.length === 0) return rows;
    return rows.filter((row) => selectedTypes.includes(row.type));
  };

  const activityColumns = useMemo(
    () =>
      getActivityColumns({
        includeStatus: true,
        enableTypeFilter: true,
        handleTypeChange,
        selectedTypes,
      }),
    [selectedTypes]
  );

  const activityColumnsWithoutStatus = useMemo(
    () =>
      getActivityColumns({
        includeStatus: false,
        enableTypeFilter: true,
        handleTypeChange,
        selectedTypes,
      }),
    [selectedTypes]
  );

  return (
    <div style={{ padding: 24 }}>
      <CustomCard height={500} width="100%" className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">กิจกรรมสหกิจ</h2>
        <TableRedesign
          columns={activityColumns}
          rows={filterByType(rows1) ?? []}
          height={420}
          width="100%"
          borderRadius={14}
        />
      </CustomCard>

      <CustomCard height={500} width="100%" className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">กิจกรรมสหกิจที่ร่าง</h2>
        <TableRedesign
          columns={activityColumns}
          rows={filterByType(rows2) ?? []}
          height={420}
          width="100%"
          borderRadius={14}
        />
      </CustomCard>

      <CustomCard height={500} width="100%">
        <h2 className="text-2xl font-semibold mb-4">
          กิจกรรมสหกิจที่ให้นิสิตทำแบบประเมิน
        </h2>
        <TableRedesign
          columns={activityColumnsWithoutStatus}
          rows={filterByType(rows3) ?? []}
          height={420}
          width="100%"
          borderRadius={14}
        />
      </CustomCard>
    </div>
  );
};

export default ActivityTablePage;
