import { Activity } from "./table";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../stores/Test/store_test";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface TableRowProps {
  act?: Activity;
}

const TableRow: React.FC<TableRowProps> = ({ act }) => {
  const navigate = useNavigate();
  const { updateActivityStatus } = useAppStore();

  if (!act) {
    return (
      <tr>
        <td colSpan={6} className="text-center text-gray-500 py-4">
          ❌ ข้อมูลกิจกรรมไม่ถูกต้อง
        </td>
      </tr>
    );
  }

  const handleSelectActivity = (id) => {
    navigate(`/activity-info-admin/${id}`);
  };

  return (
    <tr
      className="border-t text-center cursor-pointer hover:bg-gray-200 transition"
      onClick={() => handleSelectActivity(act.id)} // ✅ คลิกแล้วเปลี่ยนหน้า
    >
      <td className="p-2">{act.name}</td>
      <td className="p-2">
        <span
          className="px-2 py-1 rounded"
          style={{
            backgroundColor:
              act.type === "Hard Skill"
                ? "rgba(255, 174, 0, 0.2)"
                : "rgba(9, 0, 255, 0.2)",
            color: act.type === "Hard Skill" ? "#FFAE00" : "#0900FF",
            minWidth: "100px",
            display: "inline-block",
          }}
        >
          {act.type}
        </span>
      </td>
      <td className="p-2">{act.description}</td>
      <td>
        {new Intl.DateTimeFormat("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(act.start_time))}
      </td>
      <td className="p-2">
        <span className="mr-3">{act.seat}</span>
        <FontAwesomeIcon icon={faUser} className="text-2xl text-black" />
      </td>
      <td className="p-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); // ✅ ป้องกันการนำไปหน้าใหม่เมื่อกดปุ่ม
            updateActivityStatus(act.id, act.status);
          }}
          className="px-2 py-1 rounded font-medium"
          style={{
            backgroundColor: act.status === "Public" ? "#D4EDDA" : "#F8D7DA",
            color: act.status === "Public" ? "#155724" : "#721C24",
            minWidth: "100px",
            display: "inline-block",
          }}
        >
          {act.status}
        </button>
      </td>
    </tr>
  );
};

export default TableRow;
