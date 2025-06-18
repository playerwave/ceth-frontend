import React from 'react';
import Searchbar from './components/Searchbar';
import RoomToolbar from './components/toolbar';
import RoomTable from './components/roomtable';

const ListRoomAdmin = () => {
  interface Room {
    id: number;
    name: string;
    floor: number;
    building: string;
    seats: number;
  }



  const roomData: Room[] = Array.from({ length: 15 }, (_, i): Room => ({
    id: i + 1,
    name: `ห้อง IF${(i + 1).toString().padStart(2, '0')}`,
    floor: (i % 5) + 1,
    building: 'ตึก IF',
    seats: Number(20 + ((i * 5) % 40)),

  }));

  const floors = Array.from(new Set(roomData.map((r) => r.floor))).sort((a, b) => a - b);

  const [floorFilter, setFloorFilter] = React.useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredRooms = roomData.filter((room) => {
    const matchesFloor = floorFilter === 'all' || room.floor === floorFilter;
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFloor && matchesSearch;
  });

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5 relative">
      <h1 className="text-center text-2xl font-bold mb-4">จัดการห้อง</h1>

      <div className="flex justify-center items-center w-full mt-10">
        <Searchbar onSearch={setSearchTerm} />
      </div>

      <RoomToolbar
        floors={floors}
        floorFilter={floorFilter}
        setFloorFilter={setFloorFilter}
      />

      <div className="bg-white p-6 shadow-2xl rounded-lg my-10 overflow-x-auto">
        <h2 className="text-left font-semibold text-black mb-4">ห้องที่มีอยู่ในระบบ</h2>
     
          <RoomTable data={filteredRooms} />
       
      </div>
    </div>
  );
};

export default ListRoomAdmin;
