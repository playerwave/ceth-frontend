import { useState } from "react";
import TableHeader from "./table_header";
import TableRow from "./table_row";

interface Activity {
  name: string;
  type: "Hard Skill" | "Soft Skill";
  date: string;
  time: string;
  slots: string;
  status: "Public" | "Private";
}

interface TableProps {
  title: string;
  data: Activity[];
}

const Table: React.FC<TableProps> = ({ title, data }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Activity | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  const handleSort = (key: keyof Activity) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const convertToValidDate = (date: string, time: string): number => {
    // 🔹 ตรวจสอบรูปแบบวันที่ (DD/MM/YYYY หรือ YYYY-MM-DD)
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/; // DD/MM/YYYY
    const isoRegex = /^(\d{4})-(\d{2})-(\d{2})$/; // YYYY-MM-DD
    let year, month, day;

    if (dateRegex.test(date)) {
      const match = date.match(dateRegex);
      year = parseInt(match![3], 10);
      month = parseInt(match![2], 10) - 1; // **JavaScript นับเดือนจาก 0-11**
      day = parseInt(match![1], 10);
    } else if (isoRegex.test(date)) {
      const match = date.match(isoRegex);
      year = parseInt(match![1], 10);
      month = parseInt(match![2], 10) - 1;
      day = parseInt(match![3], 10);
    } else {
      console.error("❌ Invalid Date Format:", date, time);
      return NaN;
    }

    // 🔹 แยกชั่วโมงกับนาที
    const [hours, minutes] = time.split(":").map((num) => parseInt(num, 10));

    // ✅ ใช้ `Date.UTC()` เพื่อหลีกเลี่ยงปัญหา Timezone
    const timestamp = Date.UTC(year, month, day, hours, minutes);

    if (isNaN(timestamp)) {
      console.error("❌ Cannot Convert to Timestamp:", date, time);
      return NaN;
    }

    console.log("✅ Final Timestamp:", timestamp);
    return timestamp;
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];

    console.log("Sorting Key:", sortConfig.key);
    console.log("Before Sorting:", a.date, a.time, b.date, b.time);

    if (sortConfig.key === "date") {
      const dateA = convertToValidDate(a.date, a.time);
      const dateB = convertToValidDate(b.date, b.time);

      console.log("Parsed Dates:", dateA, dateB);

      if (isNaN(dateA) || isNaN(dateB)) return 0;

      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (typeof valA === "string" && typeof valB === "string") {
      return sortConfig.direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return sortConfig.direction === "asc"
      ? valA < valB
        ? -1
        : 1
      : valA > valB
      ? -1
      : 1;
  });

  return (
    <div className="bg-white p-4 shadow-md rounded-lg mb-6">
      <h2 className="text-left font-semibold text-black p-2 rounded">
        {title}
      </h2>
      <table className="w-full mt-2 border-collapse">
        <TableHeader handleSort={handleSort} sortConfig={sortConfig} />
        <tbody>
          {sortedData.map((act, index) => (
            <TableRow key={`${act.name}-${act.date}-${index}`} act={act} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
