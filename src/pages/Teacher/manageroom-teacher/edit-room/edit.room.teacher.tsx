import { Box, MenuItem, TextField } from "@mui/material";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import DeleteConfirmDialog from "./components/delete.dialog.food";
import { useNavigate } from "react-router-dom";

const EditRoomAdmin = () => {
  const [floor, setFloor] = useState("");

  const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFloor(e.target.value);
  };

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    console.log("ลบเมนูอาหาร...");
    setOpen(false);
  };
  return (
    <>
      {/* 📱 Mobile Layout */}
      <Box className="lg:hidden h-screen bg-white flex flex-col">
        <div className="p-4 pb-[120px]">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
            แก้ไขเมนูอาหาร
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

          <form className="space-y-6">
            <div>
              <label className="block font-semibold mb-2">
                คณะ <span className="text-red-500">*</span>
              </label>
              <TextField placeholder="คณะวิทยาการสารสนเทศ" fullWidth />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                ตึก / อาคาร <span className="text-red-500">*</span>
              </label>
              <TextField placeholder="IF" fullWidth />
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
                <TextField placeholder="ชื่อห้อง" fullWidth />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                ที่นั่ง <span className="text-red-500">*</span>
              </label>
              <TextField placeholder="จำนวนที่นั่งของห้อง" fullWidth />
            </div>
          </form>
        </div>

        {/* ปุ่มด้านล่างแบบ fixed */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("/list-room")}
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

        <form className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">
              คณะ <span className="text-red-500">*</span>
            </label>
            <TextField placeholder="คณะวิทยาการสารสนเทศ" fullWidth />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              ตึก / อาคาร <span className="text-red-500">*</span>
            </label>
            <TextField placeholder="IF" fullWidth />
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
              <TextField placeholder="ชื่อห้อง" fullWidth />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              ที่นั่ง <span className="text-red-500">*</span>
            </label>
            <TextField placeholder="จำนวนที่นั่งของห้อง" fullWidth />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/list-room")}
              className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="bg-blue-800 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-900"
            >
              บันทึก
            </button>
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
