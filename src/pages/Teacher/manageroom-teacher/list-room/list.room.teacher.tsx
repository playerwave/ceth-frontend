import React, { useEffect, useState } from "react";
import Searchbar from "./components/Searchbar";
import RoomToolbar from "./components/toolbar";
import RoomTable from "./components/roomtable";
import { useRoomStore } from "../../../../stores/Teacher/room.store";
import Loading from "../../../../components/Loading";

const ListRoomAdmin = () => {
  const rooms = useRoomStore((state) => state.rooms);
  const loading = useRoomStore((state) => state.loading);
  const error = useRoomStore((state) => state.error);
  const buildings = useRoomStore((state) => state.buildings);
  const initializeData = useRoomStore((state) => state.initializeData);
  const refreshData = useRoomStore((state) => state.refreshData);
  const isCacheValid = useRoomStore((state) => state.isCacheValid);

  const [floorFilter, setFloorFilter] = useState<number | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // ✅ ตรวจสอบ cache และโหลดข้อมูล
    const loadData = async () => {
      // ถ้า cache ไม่ valid หรือไม่มีข้อมูล ให้ refresh
      if (!isCacheValid() || rooms.length === 0) {
        await refreshData();
      } else {
        // ถ้า cache valid ให้ใช้ initializeData (จะไม่โหลดซ้ำ)
        await initializeData();
      }
    };
    
    loadData();
  }, [initializeData, refreshData, isCacheValid, rooms.length]);

  // ✅ เพิ่มการ refresh เมื่อกลับมาหน้า
  useEffect(() => {
    const handleFocus = () => {
      // เมื่อกลับมาหน้า ให้ refresh ข้อมูล
      refreshData();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshData]);

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

  // ✅ Loading component
  if (loading) {
    return <Loading />;
  }

  // ✅ Error component
  if (error) {
    return (
      <div className="max-w-screen-xl w-full mx-auto px-6 mt-5 relative">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">เกิดข้อผิดพลาด</p>
            <p>{error}</p>
            <button 
              onClick={refreshData}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5 relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1"></div>
        <h1 className="text-center text-2xl font-bold">จัดการห้อง</h1>
        <div className="flex-1"></div>
      </div>

      <div className="flex justify-center items-center w-full mt-10">
        <Searchbar onSearch={setSearchTerm} />
      </div>

      <RoomToolbar
        floors={floors}
        floorFilter={floorFilter}
        setFloorFilter={setFloorFilter}
      />

      <div className="bg-white p-6 shadow-2xl rounded-lg my-10 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-left font-semibold text-black">
            ห้องที่มีอยู่ในระบบ ({mappedRooms.length} ห้อง)
          </h2>
        </div>
        <RoomTable data={mappedRooms} />
      </div>
    </div>
  );

};

export default ListRoomAdmin;
