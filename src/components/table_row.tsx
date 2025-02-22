import { useNavigate } from "react-router-dom";

interface Activity {
  name: string;
  type: "Hard Skill" | "Soft Skill";
  date: string;
  time: string;
  slots: string;
  status: "Public" | "Private";
}

interface TableRowProps {
  act: Activity;
}

const TableRow: React.FC<TableRowProps> = ({ act }) => {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/edit-activity/${act.name}`); // ✅ เปลี่ยนไปหน้าแก้ไขกิจกรรม
  };

  return (
    <tr
      className="border-t text-center cursor-pointer hover:bg-gray-200 transition"
      onClick={handleRowClick} // ✅ ให้คลิกแถวแล้วเปลี่ยนหน้า
    >
      <td className="p-2">{act.name}</td>
      <td className="p-2">
        <span
          className={`px-2 py-1 text-white rounded ${
            act.type === "Hard Skill" ? "bg-yellow-500" : "bg-purple-500"
          }`}
        >
          {act.type}
        </span>
      </td>
      <td className="p-2">Participating in cooperative education activities</td>
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
