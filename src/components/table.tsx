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

  // ✅ ใช้ useMemo เพื่อเรียงลำดับข้อมูลก่อนแสดงผล
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const key = sortConfig.key as keyof Activity; // ✅ ยืนยันว่า key เป็น keyof Activity แน่นอน
      const valueA = a[key] as string;
      const valueB = b[key] as string;

      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div className="bg-white p-4 shadow-md rounded-lg mb-6">
      <h2 className="text-left font-semibold text-black p-2 rounded">
        {title}
      </h2>
      {sortedData.length === 0 ? (
        <p className="text-center text-gray-500 py-4">📭 ไม่มีข้อมูลกิจกรรม</p>
      ) : (
        <table className="w-full mt-2 border-collapse">
          <TableHeader handleSort={handleSort} sortConfig={sortConfig} />
          <tbody>
            {sortedData.map((act, index) => (
              <TableRow key={index} act={act} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
