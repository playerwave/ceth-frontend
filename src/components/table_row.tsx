import { Activity } from "../components/table"; // ✅ เปลี่ยน path ตามที่ถูกต้อง

interface TableRowProps {
  act?: Activity; // ✅ ป้องกัน `undefined`
}

const TableRow: React.FC<TableRowProps> = ({ act }) => {
  console.log("📊 TableRow รับข้อมูล:", act);

  if (!act) {
    return (
      <tr>
        <td colSpan={6} className="text-center text-gray-500 py-4">
          ❌ ข้อมูลกิจกรรมไม่ถูกต้อง
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-t text-center cursor-pointer hover:bg-gray-200 transition">
      <td className="p-2">{act.name}</td>
      <td className="p-2">{act.dis}</td>
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
      <td className="p-2">
        {act.date} - {act.time}
      </td>
      <td className="p-2">{act.slots}</td>
      <td className="p-2">
        <span
          className="px-2 py-1 rounded font-medium"
          style={{
            backgroundColor: act.status === "Public" ? "#D4EDDA" : "#F8D7DA",
            color: act.status === "Public" ? "#155724" : "#721C24",
            minWidth: "100px",
            display: "inline-block",
          }}
        >
          {act.status}
        </span>
      </td>
    </tr>
  );
};
export default TableRow;
