// import { Activity } from "../components/table";

// interface TableHeaderProps {
//   handleSort: (key: keyof Activity) => void;
//   sortConfig?: { key: keyof Activity | null; direction: "asc" | "desc" };
// }

// const TableHeader: React.FC<TableHeaderProps> = ({
//   handleSort,
//   sortConfig,
// }) => {
//   const columns: { key: keyof Activity; label: string; sortable: boolean }[] = [
//     {
//       key: "conpany_lecturer_name",
//       label: "ชื่อวิทยากร/ชื่อบริษัท",
//       sortable: true,
//     },
//     { key: "type", label: "ประเภท", sortable: false },
//     { key: "name", label: "ชื่อกิจกรรม", sortable: false }, // ❌ ปิดการ Sort
//     { key: "start_time", label: "วันที่จัดกิจกรรม", sortable: true },
//     { key: "seat", label: "ที่นั่ง", sortable: true },
//     { key: "status", label: "สถานะ", sortable: false }, // ❌ ปิดการ Sort
//   ];

//   const getSortIcon = (columnKey: keyof Activity) => {
//     if (!sortConfig || !sortConfig.key) return "↕";
//     return sortConfig.key === columnKey
//       ? sortConfig.direction === "asc"
//         ? "▲"
//         : "▼"
//       : "↕";
//   };

//   return (
//     <thead className="bg-blue-900 text-white">
//       <tr>
//         {columns.map((col) => (
//           <th
//             key={col.key}
//             className={`p-2 ${col.sortable ? "cursor-pointer" : ""}`}
//             onClick={() => col.sortable && handleSort(col.key)}
//           >
//             {col.key === "type" ? (
//               // 🔹 กรณีพิเศษ: คอลัมน์ "ประเภท" แสดงช่องสี
//               <div className="flex items-center justify-center">
//                 <span>{col.label}</span>
//                 <span className="w-5 h-5 bg-[#F5DEB3] border-2 border-black ml-2"></span>{" "}
//                 {/* สีเหลืองอ่อน */}
//                 <span className="w-5 h-5 bg-[#D3C3F7] border-2 border-black ml-2"></span>{" "}
//                 {/* สีม่วงอ่อน */}
//               </div>
//             ) : (
//               // 🔹 คอลัมน์ปกติ
//               <span>
//                 {col.label} {col.sortable && getSortIcon(col.key)}
//               </span>
//             )}
//           </th>
//         ))}
//       </tr>
//     </thead>
//   );
// };

// export default TableHeader;

import { Activity } from "../components/table";
import { Checkbox, FormControlLabel } from "@mui/material";

interface TableHeaderProps {
  handleSort: (key: keyof Activity) => void;
  sortConfig?: { key: keyof Activity | null; direction: "asc" | "desc" };
  setFilterType: (type: "HardSkill" | "SoftSkill" | "All") => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  handleSort,
  sortConfig,
  setFilterType,
}) => {
  const columns: { key: keyof Activity; label: string; sortable: boolean }[] = [
    {
      key: "company_lecturer_name",
      label: "ชื่อวิทยากร/ชื่อบริษัท",
      sortable: false,
    },
    { key: "type", label: "ประเภท", sortable: false },
    { key: "name", label: "ชื่อกิจกรรม", sortable: false },
    { key: "start_time", label: "วันที่จัดกิจกรรม", sortable: true },
    { key: "seat", label: "ที่นั่ง", sortable: true },
  ];

  // ฟังก์ชันสำหรับแสดงลูกศรขึ้นหรือลง
  const getSortIcon = (columnKey: keyof Activity) => {
    if (!sortConfig || !sortConfig.key) return "↕"; // ถ้ายังไม่มีการตั้งค่าให้แสดงไอคอนทั่วไป
    return sortConfig.key === columnKey
      ? sortConfig.direction === "asc"
        ? "▲" // ถ้าทิศทางเป็น asc ให้แสดงลูกศรชี้ขึ้น
        : "▼" // ถ้าทิศทางเป็น desc ให้แสดงลูกศรชี้ลง
      : "↕"; // ถ้าไม่ได้เรียงตามคอลัมน์นี้ให้แสดงไอคอนทั่วไป
  };

  return (
    <thead className="bg-blue-900 text-white">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={`p-2 ${col.sortable ? "cursor-pointer" : ""}`}
            onClick={() => col.sortable && handleSort(col.key)} // เรียงลำดับเมื่อคลิก
          >
            {col.key === "type" ? (
              <div className="flex items-center justify-center">
                <label className="ml-5">ประเภท</label>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() => setFilterType("Hard Skill")}
                      sx={{
                        color: "#F5DEB3", // สีเหลืองอ่อน
                        "&.Mui-checked": {
                          color: "#F5DEB3",
                        },
                      }}
                    />
                  }
                  sx={{ marginLeft: 1 }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() => setFilterType("Soft Skill")}
                      sx={{
                        color: "#D3C3F7", // สีม่วงอ่อน
                        "&.Mui-checked": {
                          color: "#D3C3F7",
                        },
                      }}
                    />
                  }
                  sx={{ marginRight: 1 }}
                />
              </div>
            ) : (
              <span>
                {col.label} {col.sortable && getSortIcon(col.key)}{" "}
                {/* แสดงลูกศรตามทิศทางการเรียง */}
              </span>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
