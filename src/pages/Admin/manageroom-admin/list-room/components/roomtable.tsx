import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Room {
  name: string;
  floor: number;
  building: string;
  seats: number;
}

const RoomTable: React.FC<{ data: Room[] }> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <table className="w-full border-collapse table-fixed">
      <thead className="bg-blue-900 text-white">
        <tr>
          <th className="p-3 w-1/4">ชื่อห้อง</th>
          <th className="p-3 w-1/4">ชั้น</th>
          <th className="p-3 w-1/4">ตึก/อาคาร</th>
          <th className="p-3 w-1/4">จำนวนที่นั่ง</th>
        </tr>
      </thead>
      <tbody className="text-gray-800 text-center">
        {data.map((room, i) => (
          <tr
            key={i}
            className="border-t hover:bg-gray-100 cursor-pointer transition"
            onClick={() => navigate('/edit-room')}
          >
            <td className="p-3">{room.name}</td>
            <td className="p-3">{room.floor}</td>
            <td className="p-3">{room.building}</td>
            <td className="p-3">{room.seats} ที่นั่ง</td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td colSpan={4} className="p-4 text-center text-gray-500">ไม่พบข้อมูล</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default RoomTable;
