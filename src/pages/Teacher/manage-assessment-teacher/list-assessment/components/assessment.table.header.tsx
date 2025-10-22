import { Assessment } from "../../../../../types/assessment/assessment.type";
import { cellClass, headerRowClass } from "./assessment.table.style";

interface TableHeaderProps {
  handleSort: (key: keyof Assessment | "actions") => void;
  sortConfig?: { key: keyof Assessment | "actions" | null; direction: "asc" | "desc" };
  setFilterType: (type: "Hard" | "Soft") => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  handleSort,
}) => {
  const columns: { key: keyof Assessment | "actions"; label: string; sortable: boolean }[] = [
    {
      key: "assessment_name",
      label: "ชื่อแบบประเมิน",
      sortable: true,
    },
    { key: "create_date", label: "วันที่สร้าง", sortable: true },
    { key: "last_update", label: "วันที่แก้ไข", sortable: true },
    { key: "actions", label: "", sortable: false },
  ];

  // ฟังก์ชันสำหรับแสดงลูกศร
  

  return (
<thead className={headerRowClass}>
  <tr>
    {columns.map((col) => (
      <th
        key={col.key}
        className={`${cellClass} ${col.sortable ? "cursor-pointer" : ""}`}
        onClick={() => col.sortable && handleSort(col.key)}
      >
      </th>
    ))}
  </tr>
</thead>

  );
};

export default TableHeader;
