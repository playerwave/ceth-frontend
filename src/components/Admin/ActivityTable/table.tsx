// import { useState, useMemo } from "react";
// import TableHeader from "./table_header";
// import TableRow from "./table_row";

// export type Activity = {
//   id: string;
//   name: string;
//   company_lecturer: string;
//   description: string;
//   type: "Hard Skill" | "Soft Skill";
//   start_time: Date;
//   seat: number;
//   status: "Public" | "Private";
//   registered_count: number;
// };

// interface TableProps {
//   title: string;
//   data?: Activity[];
// }

// const Table: React.FC<TableProps> = ({ title, data = [] }) => {
//   console.log("📊 ข้อมูลที่ส่งไปยัง Table:", data);

//   const [sortConfig, setSortConfig] = useState<{
//     key: keyof Activity | null;
//     direction: "asc" | "desc";
//   }>({
//     key: null,
//     direction: "asc",
//   });

//   // ✅ ฟังก์ชันสำหรับเปลี่ยนสถานะการเรียง
//   const handleSort = (key: keyof Activity) => {
//     setSortConfig((prev) => ({
//       key,
//       direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
//     }));
//   };

//   // ✅ ใช้ useMemo เพื่อเรียงลำดับข้อมูลก่อนแสดงผล
//   const sortedData = useMemo(() => {
//     if (!sortConfig.key) return data;

//     return [...data].sort((a, b) => {
//       const key = sortConfig.key as keyof Activity;

//       const valueA = a[key];
//       const valueB = b[key];

//       // ✅ ตรวจสอบและแปลงค่าถ้าเป็นตัวเลข (ที่นั่ง)
//       if (
//         key === "seat" &&
//         typeof valueA === "string" &&
//         typeof valueB === "string"
//       ) {
//         const seatsA = parseInt(valueA.split("/")[0], 10); // แยกค่าที่นั่งที่ถูกจอง
//         const seatsB = parseInt(valueB.split("/")[0], 10);
//         return sortConfig.direction === "asc"
//           ? seatsA - seatsB
//           : seatsB - seatsA;
//       }

//       // ✅ ตรวจสอบและแปลงค่าถ้าเป็นวันที่
//       if (key === "start_time") {
//         return sortConfig.direction === "asc"
//           ? new Date(valueA).getTime() - new Date(valueB).getTime()
//           : new Date(valueB).getTime() - new Date(valueA).getTime();
//       }

//       // ✅ เปรียบเทียบสตริงปกติ
//       if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
//       if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [data, sortConfig]);

//   return (
//     <div className="bg-white p-4 shadow-md rounded-lg mb-6">
//       <h2 className="text-left font-semibold text-black p-2 rounded">
//         {title}
//       </h2>
//       {sortedData.length === 0 ? (
//         <p className="text-center text-gray-500 py-4">📭 ไม่มีข้อมูลกิจกรรม</p>
//       ) : (
//         <table className="w-full mt-2 border-collapse">
//           <TableHeader handleSort={handleSort} sortConfig={sortConfig} />
//           <tbody>
//             {sortedData.map((act, index) => (
//               <TableRow key={index} act={act} />
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Table;

import { useState, useMemo } from "react";
import TableHeader from "./table_header";
import TableRow from "./table_row";

export type Activity = {
  id: string;
  name: string;
  company_lecturer: string;
  description: string;
  type: "Hard Skill" | "Soft Skill";
  start_time: Date;
  seat: number;
  status: "Public" | "Private";
  registered_count: number;
};

interface TableProps {
  title: string;
  data?: Activity[];
}

const Table: React.FC<TableProps> = ({ title, data = [] }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Activity | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  const [selectedTypes, setSelectedTypes] = useState<
    Set<"Hard Skill" | "Soft Skill">
  >(new Set());

  const handleSort = (key: keyof Activity) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleCheckboxChange = (type: "Hard Skill" | "Soft Skill") => {
    setSelectedTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) {
      return [...data].sort((a, b) => {
        const timeA = a.start_time
          ? new Date(a.start_time).getTime()
          : Infinity;
        const timeB = b.start_time
          ? new Date(b.start_time).getTime()
          : Infinity;
        return timeA - timeB;
      });
    }

    return [...data].sort((a, b) => {
      const key = sortConfig.key as keyof Activity;

      const valueA = a[key];
      const valueB = b[key];

      if (
        key === "seat" &&
        typeof valueA === "string" &&
        typeof valueB === "string"
      ) {
        const seatsA = parseInt(valueA.split("/")[0], 10);
        const seatsB = parseInt(valueB.split("/")[0], 10);
        return sortConfig.direction === "asc"
          ? seatsA - seatsB
          : seatsB - seatsA;
      }

      if (key === "start_time") {
        return sortConfig.direction === "asc"
          ? new Date(valueA).getTime() - new Date(valueB).getTime()
          : new Date(valueB).getTime() - new Date(valueA).getTime();
      }

      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    if (selectedTypes.size === 0) return sortedData; // ถ้าไม่มีการกรอง แสดงทั้งหมด
    return sortedData.filter((item) => selectedTypes.has(item.type)); // แสดงเฉพาะประเภทที่เลือก
  }, [sortedData, selectedTypes]);

  return (
    <div className="bg-white p-4 shadow-md rounded-lg mb-6">
      <h2 className="text-left font-semibold text-black p-2 rounded">
        {title}
      </h2>
      <table className="w-full mt-2 border-collapse">
        <TableHeader
          handleSort={handleSort}
          sortConfig={sortConfig}
          setFilterType={handleCheckboxChange}
        />
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-4">
                📭 ไม่มีข้อมูลกิจกรรม
              </td>
            </tr>
          ) : (
            filteredData.map((act, index) => <TableRow key={index} act={act} />)
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
