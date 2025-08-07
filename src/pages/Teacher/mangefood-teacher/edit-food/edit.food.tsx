import { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";
import Button from "../../../../components/Button";
import { Trash2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Food } from "../../../../types/model";
import { updateFood, deleteFood } from "../../../../service/Teacher/food.service";
import { useSearchParams } from "react-router-dom";
import { useFoodStore } from "../../../../stores/Teacher/food.store.teacher";
import Dialog2 from "../../../../components/Dialog2";
import { toast } from "sonner";
import Loading from "../../../../components/Loading";

const EditFoodAdmin = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const food = location.state?.food as Food | undefined;
  const [searchParams] = useSearchParams();
  const id = Number(searchParams.get("id"));
  const [foodName, setFoodName] = useState(food?.food_name ?? "");
  const { fetchFoodById } = useFoodStore();
  const [foodData, setFoodData] = useState<Food | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFood = async () => {
      if (!id) return;
      const result = await fetchFoodById(id);
      if (result) {
        setFoodData(result);
        setFoodName(result.food_name);
      } else {
        alert("❌ ไม่พบเมนูอาหารที่ต้องการแก้ไข");
        // navigate("/list-food-teacher");
      }
    };
    loadFood();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodData) return;

    setLoading(true);
    try {
      await updateFood({
        food_id: foodData.food_id,
        food_name: foodName,
        status: "Active",
        faculty_id: foodData.faculty_id,
      });

      toast.success("อัปเดตอาหารสำเร็จ");
      
    } catch (error) {
      console.error("❌ อัปเดตไม่สำเร็จ:", error);
      toast.error("ไม่สามารถอัปเดตอาหารได้");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!foodData?.food_id) return;

    setLoading(true);
    try {
      await deleteFood(foodData.food_id);
      toast.success("ลบอาหารสำเร็จ");
      navigate("/list-food-teacher");
    } catch (error) {
      console.error("❌ ลบอาหารไม่สำเร็จ:", error);
      toast.error("ไม่สามารถลบอาหารได้");
    } finally {
      setLoading(false);
    }

    setOpen(false);
  };

  return (
    <>
      {loading && <Loading />}
      
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
              <Button
                onClick={() => setOpen(true)}
                bgColor="#dc2626"
                startIcon={<Trash2 size={16} />}
                className="!px-3 !py-1 whitespace-nowrap"
              >
                ลบอาหาร
              </Button>
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
                  <Button
                    onClick={() => navigate("/list-food-teacher")}
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
        </div>
      </Box>

      {/* Desktop */}
      <Box className="hidden lg:block justify-items-center">
        <div className="w-320 mx-auto ml-2xl mt-30 mb-5 p-6 border bg-white border-gray-200 rounded-lg shadow-xl flex flex-col h-200">
          <div className="flex w-full mb-5">
            <h1 className="text-4xl font-bold text-center w-full ml-30">
              แก้ไขเมนูอาหาร
            </h1>

            <Button
              onClick={() => setOpen(true)}
              bgColor="#dc2626"
              startIcon={<Trash2 size={16} />}
              className="whitespace-nowrap"
            >
              ลบอาหาร
            </Button>
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
      <Dialog2
        open={open}
        title="ลบอาหาร"
        message="คุณแน่ใจหรือไม่ที่ต้องการลบอาหารนี้ลบแล้วไม่สามารถกู้คืนได้ "
        icon={<AlertCircle className="w-6 h-6 text-red-500" />}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default EditFoodAdmin;
