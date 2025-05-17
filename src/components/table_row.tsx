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
      <td className="p-2">{act.description}</td>
      <td className="p-2">
        <span
          className={`px-2 py-1 text-white rounded ${
            act.type === "Hard Skill" ? "bg-yellow-500" : "bg-purple-500"
          }`}
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
          className={`px-2 py-1 rounded ${
            act.status === "Public" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {act.status}
        </span>
      </td>
    </tr>
  );
};
export default TableRow;
