// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";
// import { ColumnConfig } from "./Table_re"; // ✅ import type

// export const activityColumns: ColumnConfig[] = [
//   {
//     key: "name",
//     header: "ชื่อกิจกรรม",
//     maxLength: 30,
//   },
//   {
//     key: "type",
//     header: "ประเภท",
//     render: (value) => (
//       <span
//         className="px-2 py-1 rounded inline-block min-w-[100px]"
//         style={{
//           backgroundColor:
//             value === "Hard Skill"
//               ? "rgba(255, 174, 0, 0.2)"
//               : "rgba(9, 0, 255, 0.2)",
//           color: value === "Hard Skill" ? "#FFAE00" : "#0900FF",
//         }}
//       >
//         {value}
//       </span>
//     ),
//   },
//   {
//     key: "description",
//     header: "คำอธิบาย",
//     maxLength: 40,
//   },
//   {
//     key: "start_time",
//     header: "วันเริ่มกิจกรรม",
//     render: (value) =>
//       new Intl.DateTimeFormat("th-TH", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       }).format(new Date(value)),
//   },
//   {
//     key: "seat",
//     header: "จำนวนที่นั่ง",
//     render: (value) => (
//       <span className="flex items-center justify-center gap-2">
//         {value}
//         <FontAwesomeIcon icon={faUser} className="text-black text-lg" />
//       </span>
//     ),
//   },
//   {
//     key: "status",
//     header: "สถานะ",
//     render: (value, row) => (
//       <button
//         onClick={() => row.updateStatus?.(row.id, row.status)}
//         className="px-2 py-1 rounded font-medium min-w-[100px]"
//         style={{
//           backgroundColor: value === "Public" ? "#D4EDDA" : "#F8D7DA",
//           color: value === "Public" ? "#155724" : "#721C24",
//         }}
//       >
//         {value}
//       </button>
//     ),
//   },
// ];
