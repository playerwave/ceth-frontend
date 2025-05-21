import React from "react";
import { useNavigate } from "react-router-dom";

interface Food {
  name: string;
  price: string;
  phone: string;
}

interface Props {
  data: Food[];
}

const FoodTable: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <table className="w-full mt-2 border-collapse table-fixed">
      <thead className="bg-blue-900 text-white h-13">
        <tr className="border-t text-center">
          <th className="p-2 text-center">ชื่อเมนู</th>
          <th className="p-2 text-center">ราคา</th>
          <th className="p-2 text-center">เบอร์ติดต่อ</th>
        </tr>
      </thead>
      <tbody className="text-gray-800">
        {data.map((food, i) => (
          <tr
            key={i}
            className="border-t text-center cursor-pointer hover:bg-gray-200 transition"
            onClick={() => navigate("/edit-food")}
          >
            <td className="p-3 text-center truncate">{food.name}</td>
            <td className="p-3 text-center">{food.price}</td>
            <td className="p-3 text-center">{food.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FoodTable;
