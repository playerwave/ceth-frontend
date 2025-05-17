import { useState, useMemo } from "react";
import TableHeader from "./table_header";
import TableRow from "./table_row";

export type Activity = {
  name: string;
  dis: string;
  type: "Hard Skill" | "Soft Skill";
  date: string;
  time: string;
  slots: string;
  status: "Public" | "Private";
};

interface TableProps {
  title: string;
  data?: Activity[];
}

const Table: React.FC<TableProps> = ({ title, data = [] }) => {
  console.log("📊 ข้อมูลที่ส่งไปยัง Table:", data);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Activity | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  // ✅ ฟังก์ชันสำหรับเปลี่ยนสถานะการเรียง
  const handleSort = (key: keyof Activity) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg mb-6">
      <h2 className="text-left font-semibold text-black p-2 rounded">
        {title}
      </h2>
      <table className="w-full mt-2 border-collapse">
        <TableHeader handleSort={handleSort} sortConfig={sortConfig} />
        <tbody>
          {data.map((act, index) => (
            <TableRow key={`${act.name}-${act.date}-${index}`} act={act} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
