import React, { useEffect, useState } from "react";
import Searchbar from "./components/Searchbar";
import RoomToolbar from "./components/toolbar";
import RoomTable from "./components/roomtable";
import { useRoomStore } from "../../../../stores/Teacher/room.store";


const ListRoomAdmin = () => {
  const rooms = useRoomStore((state) => state.rooms);
  const fetchRooms = useRoomStore((state) => state.fetchRooms);
  const loading = useRoomStore((state) => state.loading);
  const buildings = useRoomStore((state) => state.buildings);  // ✅ ตอนนี้ใช้ได้แล้ว
  const fetchBuildings = useRoomStore((state) => state.fetchBuildings);

  const [floorFilter, setFloorFilter] = useState<number | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRooms();
    fetchBuildings(); // ✅ โหลดชื่ออาคารมาพร้อมกัน
  }, [fetchRooms]);

  const floors: number[] = Array.from(
    new Set(rooms.map((r) => parseInt(r.floor)))
  ).sort((a, b) => a - b);

  const filteredRooms = rooms.filter((room) => {
    const floorNum = parseInt(room.floor);
    const matchesFloor = floorFilter === "all" || floorNum === floorFilter;
    const matchesSearch = room.room_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFloor && matchesSearch;
  });


  const mappedRooms = filteredRooms.map((room) => {
    const building = buildings.find(b => b.building_id === room.building_id);
    return {
      ...room,
      building_name: building?.building_name ?? "ไม่พบชื่ออาคาร"
    };
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
        <h2 className="text-left font-semibold text-black mb-4">
          ห้องที่มีอยู่ในระบบ
        </h2>
        <RoomTable data={mappedRooms} />

      </div>
    </div>
  );
};

export default ListRoomAdmin;
