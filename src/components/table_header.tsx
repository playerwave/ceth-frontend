import { Activity } from "../components/table";

interface TableHeaderProps {
  handleSort: (key: keyof Activity) => void;
  sortConfig?: { key: keyof Activity | null; direction: "asc" | "desc" };
}

const TableHeader: React.FC<TableHeaderProps> = ({
  handleSort,
  sortConfig,
}) => {
  const columns: { key: keyof Activity; label: string; sortable: boolean }[] = [
    { key: "name", label: "ชื่อวิทยากร/ชื่อบริษัท", sortable: true },
    { key: "description", label: "ชื่อกิจกรรม", sortable: false }, // ❌ ปิดการ Sort
    { key: "type", label: "ประเภท", sortable: false },
    { key: "start_time", label: "วันที่", sortable: true },
    { key: "seat", label: "ที่นั่ง", sortable: true },
    { key: "status", label: "สถานะ", sortable: false }, // ❌ ปิดการ Sort
  ];

  const getSortIcon = (columnKey: keyof Activity) => {
    if (!sortConfig || !sortConfig.key) return "↕";
    return sortConfig.key === columnKey
      ? sortConfig.direction === "asc"
        ? "▲"
        : "▼"
      : "↕";
  };

  return (
    <thead className="bg-blue-900 text-white">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={`p-2 ${col.sortable ? "cursor-pointer" : ""}`}
            onClick={() => col.sortable && handleSort(col.key)}
          >
            {col.label} {col.sortable && getSortIcon(col.key)}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
