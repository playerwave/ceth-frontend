import { Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Button";
import { useState } from "react";
import { createFood } from "../../../../service/Teacher/food.service";

const CreateFoodAdmin = () => {
  const navigate = useNavigate();
  const [foodName, setFoodName] = useState("");


  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await createFood({
      food_name: foodName,
      status: "Active",
      faculty_id: 1,
    });

    console.log("✅ Food created:", res); // ดูข้อมูลที่ส่งกลับมา
    alert("✅ บันทึกเมนูอาหารเรียบร้อย");

    navigate("/list-food-teacher");
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการสร้างอาหาร:", error);
    alert("❌ เกิดข้อผิดพลาดในการสร้างอาหาร");
  }
};

  return (
    <>
      {/* Mobile & iPad - Fixed Layout */}
      <Box className="flex lg:hidden h-screen bg-white flex-col">
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto">
          {/* Form Content */}
          <div className="p-4 pb-20">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              เพิ่มเมนูอาหาร
            </h2>

            <form className="space-y-6"  onSubmit={handleSubmit}>
              {/* ชื่ออาหาร */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ชื่ออาหาร <span className="text-red-500">*</span>
                </label>
                <TextField
                  type="text"
                  placeholder="ชื่ออาหาร"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  fullWidth
                  size="medium"
                  sx={{
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#d1d5db",
                      },
                    },
                  }}
                />
              </div>

           
            {/* Fixed Bottom Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("/list-food-teacher")}
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
        </div>

       
      </Box>

      {/* Desktop & Laptop - Original Card Layout */}
      <Box className="hidden lg:flex items-center justify-center mt-55 ">
  <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-8">
    <h1 className="text-3xl font-bold text-center mb-6">เพิ่มเมนูอาหาร</h1>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ชื่ออาหาร */}
      <div className="grid">
        <label className="font-semibold mb-1">
          ชื่ออาหาร <span className="text-red-500">*</span>
        </label>
        <TextField
          type="text"
          placeholder="ชื่ออาหาร"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          fullWidth
        />
      </div>

      {/* ปุ่ม */}
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" bgColor="red" onClick={() => navigate("/list-food-teacher")}>
          ยกเลิก
        </Button>
        <Button type="submit">บันทึก</Button>
      </div>
    </form>
  </div>
</Box>

    </>
  );
};

export default CreateFoodAdmin;
