import { Box, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoomStore } from "../../../../stores/Teacher/room.store";
import Button from "../../../../components/Button";
import { toast } from "sonner";
import Loading from "../../../../components/Loading";



const CreateRoomAdmin = () => {
  const faculties = useRoomStore((state) => state.faculties);
  const fetchFaculties = useRoomStore((state) => state.fetchFaculties);
  const fetchBuildings = useRoomStore((state) => state.fetchBuildings);
  const buildings = useRoomStore((state) => state.buildings);
  
  const [floor, setFloor] = useState("");
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [facultyId, setFacultyId] = useState<number>(1);
  const [buildingId, setBuildingId] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFaculties(); // ✅ ดึงข้อมูลคณะ
    fetchBuildings();   // ✅ ดึงข้อมูลอาคาร
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomName || !floor || !seatNumber) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    setLoading(true);
    try {
      await useRoomStore.getState().createRoom({
        room_name: roomName,
        floor: floor.toString(),
        seat_number: parseInt(seatNumber),
        faculty_id: facultyId,
        building_id: buildingId,
        status: "Active",
      });
      toast.success("สร้างห้องสำเร็จ");
      navigate("/list-room-teacher");
    } catch (err) {
      console.error("❌ Error creating room:", err);
      toast.error("ไม่สามารถสร้างห้องได้");
    } finally {
      setLoading(false);
    }
  };

  const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFloor(e.target.value);
  };

  return (
    <>
      {loading && <Loading />}
      
      {/* 📱 Mobile Layout */}
      <Box className="lg:hidden h-screen bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 pb-24">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
            เพิ่มห้อง
          </h2>
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
                {faculties.map((faculty) => (
                  <MenuItem key={faculty.faculty_id} value={faculty.faculty_id}>
                    {faculty.faculty_name}
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
                {buildings.map((b) => (
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
                  placeholder="ชื่อห้อง"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  fullWidth
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                ที่นั่ง <span className="text-red-500">*</span>
              </label>
              <TextField
                placeholder="จำนวนที่นั่งของห้อง"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
                fullWidth
              />
            </div>

            {/* ปุ่มด้านล่างแบบ fixed */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
              <div className="flex justify-between gap-4">
                <Button
                  onClick={() => navigate("/list-room-teacher")}
                  bgColor="#dc2626"
                  width="30%"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  bgColor="#1E3A8A"
                  width="30%"
                >
                  บันทึก
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Box>

      {/* 💻 Desktop Layout */}
      <Box className="hidden lg:block max-w-4xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-8">เพิ่มห้อง</h1>
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
              {faculties.map((faculty) => (
                <MenuItem key={faculty.faculty_id} value={faculty.faculty_id}>
                  {faculty.faculty_name}
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
              {buildings.map((b) => (
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
                placeholder="ชื่อห้อง"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                fullWidth
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              ที่นั่ง <span className="text-red-500">*</span>
            </label>
            <TextField
              placeholder="จำนวนที่นั่งของห้อง"
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              fullWidth
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
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
    </>
  );
};

export default CreateRoomAdmin;
