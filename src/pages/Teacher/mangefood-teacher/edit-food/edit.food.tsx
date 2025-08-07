import { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";
import Button from "../../../../components/Button";
import { Trash2 } from "lucide-react";
import DeleteConfirmDialog from "./components/delete.dialog.food";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Food } from "../../../../types/model";
import { updateFood, deleteFood } from "../../../../service/Teacher/food.service";
import { useSearchParams } from "react-router-dom";
import { useFoodStore } from "../../../../stores/Teacher/food.store.teacher";



const EditFoodAdmin = () => {


  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const food = location.state?.food as Food | undefined;
  const [searchParams] = useSearchParams();
  const id = Number(searchParams.get("id"));
  const [foodName, setFoodName] = useState(food?.food_name ?? "");
  const { fetchFoodById } = useFoodStore(); // ✅ ต้องมีแบบนี้ก่อนใช้
  const [foodData, setFoodData] = useState<Food | null>(null);



  useEffect(() => {
    const loadFood = async () => {
      if (!id) return;
      const result = await fetchFoodById(id);
      if (result) {
        setFoodData(result);
        setFoodName(result.food_name); // ✅ preload ลง input
      } else {
        alert("❌ ไม่พบเมนูอาหารที่ต้องการแก้ไข");
        navigate("/list-food-teacher");
      }
    };
    loadFood();
  }, [id]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodData) return;

    try {
      await updateFood({
        food_id: foodData.food_id,
        food_name: foodName,
        status: "Active", // หรือ foodData.status
        faculty_id: foodData.faculty_id,
      });

      alert("✅ บันทึกเมนูเรียบร้อยแล้ว");
      navigate("/list-food-teacher");
    } catch (error) {
      console.error("❌ อัปเดตไม่สำเร็จ:", error);
      alert("❌ เกิดข้อผิดพลาดในการอัปเดตชื่ออาหาร");
    }
  };

  const handleDelete = async () => {
    if (!foodData?.food_id) return;

    try {
      await deleteFood(foodData.food_id);
      alert("✅ ลบเมนูอาหารเรียบร้อยแล้ว");
      navigate("/list-food-teacher");
    } catch (error) {
      console.error("❌ ลบเมนูอาหารไม่สำเร็จ:", error);
      alert("❌ เกิดข้อผิดพลาดในการลบเมนูอาหาร");
    }

    setOpen(false);
  };

  return (
    <>
      {/* Mobile & Tablet */}
      <Box
        className="flex lg:hidden bg-white flex-col"
        sx={{ height: "100dvh" }}
      >
        <div className="flex-1 overflow-y-auto">
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

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* ชื่ออาหาร */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ชื่ออาหาร <span className="text-red-500">*</span>
                </label>
                <TextField
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="ชื่ออาหาร"
                  fullWidth
                />

              </div>

              {/* ปุ่มล่าง (Mobile) */}
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

      {/* Desktop */}
      {/* Desktop & Laptop - Original Card Layout */}
      <Box className="hidden lg:block justify-items-center">
        <div className="w-320 mx-auto ml-2xl mt-30 mb-5 p-6 border bg-white border-gray-200 rounded-lg shadow-xl flex flex-col h-200">
          <div className="flex w-full mb-5">
            <h1 className="text-4xl font-bold text-center w-full ml-30">
              แก้ไขเมนูอาหาร
            </h1>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="bg-red-600 text-white w-36 h-10 rounded-lg hover:bg-red-700 items-center justify-center flex"
            >
              <Trash2 /> ลบเมนูอาหาร
            </button>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* ชื่ออาหาร */}
            <div className="grid mt-8">
              <label className="w-96 text-left font-semibold mb-1">
                ชื่ออาหาร <span className="text-red-500">*</span>
              </label>
              <TextField
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="ชื่ออาหาร"
                fullWidth
              />

            </div>



            {/* ปุ่ม */}
            <div className="col-span-2 flex justify-end gap-4 mt-75">
              <Button
                type="button"
                onClick={() => navigate("/list-food-teacher")}
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
        </div>
      </Box>
      {/* Dialog ลบ */}
      <DeleteConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default EditFoodAdmin;
