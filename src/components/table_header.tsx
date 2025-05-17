import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Activity {
  name: string;
  type: "Hard Skill" | "Soft Skill";
  date: string;
  time: string;
  slots: string;
  status: "Public" | "Private";
}

interface TableHeaderProps {
  handleSort: (key: keyof Activity) => void; // ✅ เปลี่ยนจาก `string` เป็น `keyof Activity`
  sortConfig: { key: keyof Activity | null; direction: "asc" | "desc" };
}

const TableHeader: React.FC<TableHeaderProps> = ({
  handleSort,
  sortConfig,
}) => {
  const columns: { key: keyof Activity; label: string; sortable: boolean }[] = [
    { key: "name", label: "ชื่อกิจกรรม", sortable: true },
    { key: "dis", label: "รายละเอียด", sortable: false }, // ❌ ปิดการ Sort
    { key: "type", label: "ประเภท", sortable: true },
    { key: "date", label: "วันที่", sortable: true },
    { key: "slots", label: "ที่นั่ง", sortable: true },
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
    <thead>
      <tr className="bg-[#1E3A8A] text-white rounded border-b">
        {[
          { key: "name", label: "ชื่อบริษัท/วิทยากร", sortable: true },
          { key: "type", label: "ประเภท", sortable: true },
          { key: "date", label: "วันที่จัดกิจกรรม", sortable: true },
          { key: "slots", label: "ที่นั่ง", sortable: true },
          { key: "status", label: "สถานะ", sortable: false },
        ].map(({ key, label, sortable }) => (
          <th
            key={key}
            className={`p-2 ${sortable ? "cursor-pointer" : ""}`}
            onClick={
              sortable ? () => handleSort(key as keyof Activity) : undefined
            }
          >
            {col.label} {col.sortable && getSortIcon(col.key)}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
