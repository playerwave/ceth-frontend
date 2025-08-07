import { Box, MenuItem, TextField } from "@mui/material";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import DeleteConfirmDialog from "./components/delete.dialog.food";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRoomStore } from "../../../../stores/Teacher/room.store";
import { fetchRoomById, updateRoom } from "../../../../service/Teacher/room.service";
import { Room } from "../../../../types/model";
import Button from "../../../../components/Button";

const EditRoomAdmin = () => {

  const { deleteRoom } = useRoomStore();

  const [floor, setFloor] = useState("");
  const [searchParams] = useSearchParams();
  const roomId = Number(searchParams.get("id")); // → 9
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [roomName, setRoomName] = useState("");
  const [seatCount, setSeatCount] = useState("");
  const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFloor(e.target.value);
  };
  const [facultyId, setFacultyId] = useState<number>(1); // หรือใช้ null แล้วให้ default หลังจากโหลดข้อมูล
  const [buildingId, setBuildingId] = useState<number>(1); // หรือใช้ null แล้วให้ default หลังจากโหลดข้อมูล
  const faculties = useRoomStore((state) => state.faculties);
  const buildings = useRoomStore((state) => state.buildings);
  const fetchFaculties = useRoomStore((state) => state.fetchFaculties);
  const fetchBuildings = useRoomStore((state) => state.fetchBuildings);

  useEffect(() => {
    const loadRoom = async () => {
      if (!roomId) return;
      const result = await fetchRoomById(roomId);
      if (result) {
        setRoomData(result);

        setRoomName(result.room_name);
        setFloor(result.floor);
        setSeatCount(result.seat_number.toString());
        // ...
      } else {
        alert("❌ ไม่พบห้องนี้");
        navigate("/list-room-teacher");
      }
    };
    loadRoom();
  }, [roomId]);

  useEffect(() => {
    fetchFaculties();
    fetchBuildings();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomId || !roomName || !floor || !seatCount) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    try {
      await useRoomStore.getState().updateRoom({
        room_id: roomId,
        room_name: roomName,
        floor: floor.toString(),
        seat_number: parseInt(seatCount),
        faculty_id: facultyId,
        building_id: buildingId,
        status: "Active"
      });

      alert("✅ อัปเดตห้องเรียบร้อยแล้ว");
      navigate("/list-room-teacher");
    } catch (err) {
      console.error("❌ Error updating room:", err);
      alert("❌ ไม่สามารถอัปเดตห้องได้");
    }
  };



  const handleDelete = async () => {
    if (!roomId) return;

    try {
      await deleteRoom(roomId);
      alert("✅ ลบห้องเรียบร้อยแล้ว");
      navigate("/list-room-teacher");
    } catch (error) {
      console.error("❌ ลบห้องไม่สำเร็จ:", error);
      alert("❌ เกิดข้อผิดพลาดในการลบห้อง");
    }

    setOpen(false);
  };

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);


  return (
    <>
      {/* 📱 Mobile Layout */}
      <Box className="lg:hidden h-screen bg-white flex flex-col">
        <div className="p-4 pb-[120px]">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
            แก้ไขห้อง
          </h2>

          {/* 🔴 ปุ่มลบบน Mobile */}
          <div className="flex justify-end mb-4">
            <Trash2
              size={20}
              type="button"
              onClick={() => setOpen(true)}
              className="text-red-500  "
            />
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block font-semibold mb-2">
                คณะ <span className="text-red-500">*</span>
              </label>
              <TextField
                select
                value={facultyId}
                onChange={(e) => setFacultyId(Number(e.target.value))}
                fullWidth
              >
                {faculties.map(f => (
                  <MenuItem key={f.faculty_id} value={f.faculty_id}>
                    {f.faculty_name}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                ตึก / อาคาร <span className="text-red-500">*</span>
              </label>
              <TextField
                select
                value={buildingId}
                onChange={(e) => setBuildingId(Number(e.target.value))}
                fullWidth
              >
                {buildings.map(b => (
                  <MenuItem key={b.building_id} value={b.building_id}>
                    {b.building_name}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-2">
                  เลือกชั้น <span className="text-red-500">*</span>
                </label>
                <TextField
                  select
                  value={floor}
                  onChange={handleFloorChange}
                  fullWidth
                >
                  {[...Array(11)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      ชั้น {i + 1}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-2">
                  ชื่อห้อง <span className="text-red-500">*</span>
                </label>
                <TextField
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="ชื่อห้อง"
                  fullWidth
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                ที่นั่ง <span className="text-red-500">*</span>
              </label>
              <TextField
                value={seatCount}
                onChange={(e) => setSeatCount(e.target.value)}
                placeholder="จำนวนที่นั่งของห้อง"
                fullWidth
              />

            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/list-room-teacher")}
                  className=" w-30 px-4 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-md"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className=" w-30 px-4 py-1 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-full text-md"
                >
                  บันทึกเมนู
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ปุ่มด้านล่างแบบ fixed */}

      </Box>

      {/* 💻 Desktop Layout */}
      <Box className="hidden lg:block max-w-4xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex w-full mb-5">
          <h1 className="text-4xl font-bold w-full ">แก้ไขห้อง</h1>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="bg-red-600 text-white w-36 h-10 rounded-lg hover:bg-red-700 items-center justify-center flex"
          >
            <Trash2 /> ลบเมนูอาหาร
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-2">
              คณะ <span className="text-red-500">*</span>
            </label>
            <TextField
              select
              value={facultyId}
              onChange={(e) => setFacultyId(Number(e.target.value))}
              fullWidth
            >
              {faculties.map(f => (
                <MenuItem key={f.faculty_id} value={f.faculty_id}>
                  {f.faculty_name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              ตึก / อาคาร <span className="text-red-500">*</span>
            </label>
            <TextField
              select
              value={buildingId}
              onChange={(e) => setBuildingId(Number(e.target.value))}
              fullWidth
            >
              {buildings.map(b => (
                <MenuItem key={b.building_id} value={b.building_id}>
                  {b.building_name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-2">
                เลือกชั้น <span className="text-red-500">*</span>
              </label>
              <TextField
                select
                value={floor}
                onChange={handleFloorChange}
                fullWidth
              >
                {[...Array(11)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    ชั้น {i + 1}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-2">
                ชื่อห้อง <span className="text-red-500">*</span>
              </label>
              <TextField
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="ชื่อห้อง"
                fullWidth
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              ที่นั่ง <span className="text-red-500">*</span>
            </label>
            <TextField
              value={seatCount}
              onChange={(e) => setSeatCount(e.target.value)}
              placeholder="จำนวนที่นั่งของห้อง"
              fullWidth
            />

          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              onClick={() => navigate("/list-room-teacher")}
              bgColor="red"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              bgColor="blue"
            >
              บันทึก
            </Button>
          </div>
        </form>
      </Box>

      {/* ✅ ย้าย Dialog มาไว้ใน return */}
      <DeleteConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default EditRoomAdmin;
