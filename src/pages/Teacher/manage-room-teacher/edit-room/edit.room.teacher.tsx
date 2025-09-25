import { Box, MenuItem, TextField } from "@mui/material";
import { Trash2, AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRoomStore } from "../../../../stores/Teacher/room.store";
import { fetchRoomById } from "../../../../service/Teacher/room.service";
import { Room } from "../../../../types/model";
import Button from "../../../../components/Button";
import Dialog2 from "../../../../components/Dialog2";
import { toast } from "sonner";
import Loading from "../../../../components/Loading";

const EditRoomAdmin = () => {

  const { deleteRoom } = useRoomStore();

  const [floor, setFloor] = useState("");
  const [searchParams] = useSearchParams();
  const roomId = Number(searchParams.get("id")); // → 9
  const [, setRoomData] = useState<Room | null>(null);
  const [roomName, setRoomName] = useState("");
  const [seatCount, setSeatCount] = useState("");
  const [loading, setLoading] = useState(false);
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
        setFacultyId(result.faculty_id);
        setBuildingId(result.building_id);
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

    setLoading(true);
    try {
      // ✅ invalidate cache ก่อน update
      useRoomStore.getState().invalidateCache();
      
      await useRoomStore.getState().updateRoom({
        room_id: roomId,
        room_name: roomName,
        floor: floor.toString(),
        seat_number: parseInt(seatCount),
        faculty_id: facultyId,
        building_id: buildingId,
        status: "Active"
      });

      toast.success("อัปเดตห้องเรียบร้อยแล้ว");
      // ไม่ navigate ไปหน้า list แล้ว ให้อยู่ที่หน้าแก้ไข
    } catch (err) {
      console.error("❌ Error updating room:", err);
      toast.error("ไม่สามารถอัปเดตห้องได้");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!roomId) return;

    setLoading(true);
    try {
      // ✅ invalidate cache ก่อน delete
      useRoomStore.getState().invalidateCache();
      
      await deleteRoom(roomId);
      toast.success("ลบห้องเรียบร้อยแล้ว");
      navigate("/list-room-teacher");
    } catch (error) {
      console.error("❌ ลบห้องไม่สำเร็จ:", error);
      toast.error("เกิดข้อผิดพลาดในการลบห้อง");
    } finally {
      setLoading(false);
    }

    setOpen(false);
  };

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);


  return (
    <>
      {loading && <Loading />}
      
      {/* 📱 Mobile Layout */}
      <Box className="lg:hidden h-screen bg-white flex flex-col">
        <div className="p-4 pb-[120px]">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
            แก้ไขห้อง
            แก้ไขห้อง
          </h2>

          {/* 🔴 ปุ่มลบบน Mobile */}
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setOpen(true)}
              bgColor="#dc2626"
              startIcon={<Trash2 size={16} />}
              className="!px-3 !py-1 whitespace-nowrap"
            >
              ลบห้อง
            </Button>
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
                data-cy="faculty-dropdown"
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
                data-cy="building-dropdown"
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
                  data-cy="floor-dropdown"
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
                  data-cy="room-name-input"
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
                data-cy="seat-number-input"
              />

            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
              <div className="flex justify-between gap-4">
                <Button
                  onClick={() => navigate("/list-room-teacher")}
                  bgColor="#dc2626"
                  width="30%"
                  data-cy="cancel-button"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  bgColor="#1E3A8A"
                  width="30%"
                  data-cy="save-button"
                >
                  บันทึก
                </Button>
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

          <Button
            onClick={() => setOpen(true)}
            bgColor="#dc2626"
            startIcon={<Trash2 size={16} />}
            className="whitespace-nowrap"
            data-cy="delete-button"
          >
            ลบห้อง
          </Button>
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
              onClick={() => navigate("/list-room-teacher")}
              bgColor="#dc2626"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              bgColor="#1E3A8A"
            >
              บันทึก
            </Button>
          </div>
        </form>
      </Box>

      {/* ✅ ใช้ Dialog2 แทน ConfirmDialog */}
      <Dialog2
        open={open}
        title="ลบห้อง"
        message="คุณแน่ใจหรือไม่ที่ต้องการลบห้องนี้\nลบแล้วไม่สามารถกู้คืนห้องได้ *"
        icon={<AlertCircle className="w-6 h-6 text-red-500" />}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        data-cy="delete-dialog"
      />
    </>
  );
};

export default EditRoomAdmin;
