// import { Activity } from "./table";
// import { useNavigate } from "react-router-dom";
// import { useActivityStore } from "../../stores/Student/activity_student.store";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";

// interface TableRowProps {
//   act?: Activity;
// }

// const TableRow: React.FC<TableRowProps> = ({ act }) => {
//   const navigate = useNavigate();
//   const { updateActivityStatus } = useActivityStore();

//   if (!act) {
//     return (
//       <tr>
//         <td colSpan={6} className="text-center text-gray-500 py-4">
//           ❌ ข้อมูลกิจกรรมไม่ถูกต้อง
//         </td>
//       </tr>
//     );
//   }

//   const handleSelectActivity = (id: string) => {
//     navigate("/activity-info-student", { state: { id } }); // ✅ ส่ง `id` ไปเป็น state
//   };

//   return (
//     <tr
//       className="border-t text-center cursor-pointer hover:bg-gray-200 transition"
//       onClick={() => handleSelectActivity(act.id)} // ✅ คลิกแล้วเปลี่ยนหน้า
//     >
//       <td className="p-2">{act.company_lecturer}</td>
//       <td className="p-2">
//         <span
//           className="px-2 py-1 rounded"
//           style={{
//             backgroundColor:
//               act.type === "Hard Skill"
//                 ? "rgba(255, 174, 0, 0.2)"
//                 : "rgba(9, 0, 255, 0.2)",
//             color: act.type === "Hard Skill" ? "#FFAE00" : "#0900FF",
//             minWidth: "100px",
//             display: "inline-block",
//           }}
//         >
//           {act.type}
//         </span>
//       </td>
//       <td className="p-2">
//         {act.name
//           ? act.name.split(" ").slice(0, 10).join(" ") +
//             (act.name.split(" ").length > 30 ? "..." : "")
//           : ""}
//       </td>

//       <td>
//         {act.start_time
//           ? new Intl.DateTimeFormat("th-TH", {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             }).format(new Date(act.start_time))
//           : "ยังไม่ระบุ"}
//       </td>
//       <td className="p-2">
//         <div className="flex items-center justify-center space-x-2">
//           <span className="min-w-[50px] text-center">
//             {act.registered_count}/{act.seat || "null"}
//           </span>
//           <FontAwesomeIcon icon={faUser} className="text-2xl text-black" />
//         </div>
//       </td>
//       <td className="p-2">
//         <button
//           onClick={(e) => {
//             e.stopPropagation(); // ✅ ป้องกันการนำไปหน้าใหม่เมื่อกดปุ่ม
//             updateActivityStatus(act.id, act.status);
//           }}
//           className="px-2 py-1 rounded font-medium"
//           style={{
//             backgroundColor: act.status === "Public" ? "#D4EDDA" : "#F8D7DA",
//             color: act.status === "Public" ? "#155724" : "#721C24",
//             minWidth: "100px",
//             display: "inline-block",
//           }}
//         >
//           {act.status}
//         </button>
//       </td>
//     </tr>
//   );
// };

// export default TableRow;

import { Activity } from "./table";
import { useNavigate } from "react-router-dom";
import { useActivityStore } from "../../stores/Student/activity_student.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface TableRowProps {
  act?: Activity;
}

const TableRow: React.FC<TableRowProps> = ({ act }) => {
  const navigate = useNavigate();
  const { updateActivityStatus } = useActivityStore();

  if (!act) {
    return (
      <tr>
        <td colSpan={6} className="text-center text-gray-500 py-4">
          ❌ ข้อมูลกิจกรรมไม่ถูกต้อง
        </td>
      </tr>
    );
  }

  const handleSelectActivity = (id: string) => {
    navigate("/activity-info-student", { state: { id } });
  };

  return (
    <tr
      className="border-t text-center cursor-pointer hover:bg-gray-200 transition"
      onClick={() => handleSelectActivity(act.id)}
    >
      <td className="p-2">
        {act.company_lecturer.length > 20
          ? act.company_lecturer.slice(0, 20) + "..." // ตัดข้อความที่ยาวเกิน 20 ตัวอักษร
          : act.company_lecturer}
      </td>
      <td className="p-2">
        <span
          className="px-2 py-1 rounded"
          style={{
            backgroundColor:
              act.type === "Hard Skill"
                ? "rgba(255, 174, 0, 0.2)"
                : act.type === "Soft Skill"
                ? "rgba(9, 0, 255, 0.2)"
                : "#rgba(128, 128, 128, 0.2)",
            color:
              act.type === "Hard Skill"
                ? "#FFAE00"
                : act.type === "Soft Skill"
                ? "#0900FF"
                : "B0B0B0",
            minWidth: "100px",
            display: "inline-block",
          }}
        >
          {act.type || "ยังไม่ระบุ"}
        </span>
      </td>
      <td className="p-2">
        {act.name.length > 20
          ? act.name.slice(0, 20) + "..." // ตัดข้อความที่ยาวเกิน 20 ตัวอักษร
          : act.name}
      </td>

      <td>
        {act.start_time
          ? new Intl.DateTimeFormat("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(act.start_time))
          : "ยังไม่ระบุ"}
      </td>
      <td className="p-2">
        <div className="flex items-center justify-center space-x-2">
          <span className="min-w-[50px] text-center">
            {act.registered_count}/{act.seat || "null"}
          </span>
          <FontAwesomeIcon icon={faUser} className="text-2xl text-black" />
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
