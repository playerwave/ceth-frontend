import { Activity } from "./table_student"; // ✅ เปลี่ยน path ตามที่ถูกต้อง
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface TableRowProps {
  act?: Activity; // ✅ ป้องกัน `undefined`
}

const TableRow: React.FC<TableRowProps> = ({ act }) => {
  console.log("📊 TableRow รับข้อมูล:", act);

  if (!act || act.status !== "Public") {
    return null;
  }

  return (
    <tr className="border-t text-center cursor-pointer hover:bg-gray-200 transition">
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
          // hour: "2-digit",
          // minute: "2-digit",
        }).format(new Date(act.start_time))}
      </td>

      <td className="p-2">
        <span className="mr-3">{act.seat}</span>
        <FontAwesomeIcon icon={faUser} className="text-2xl text-black" />
      </td>
    </tr>
  );
};
export default TableRow;
