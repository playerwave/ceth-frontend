// src/service/Teacher/food.service.teacher.ts
import { Food } from "@/types/food.type";
import axiosInstance from "@/libs/axios";
import { ApiFood } from "@/stores/api/food.api";

// 🔄 ดึงรายการอาหารทั้งหมด
export const getAllFoods = async (): Promise<ApiFood[]> => {
  const response = await axiosInstance.get<ApiFood[]>(
    "/teacher/food/get-foods"
  );
  return response.data;
};

// 📥 ดึงอาหารตาม ID
export const getFoodById = async (id: number): Promise<ApiFood> => {
  const response = await axiosInstance.get<ApiFood>(
    `/teacher/food/get-food/${id}`
  );
  return response.data;
};

// ➕ เพิ่มอาหาร (ไม่ใช้ DTO)
export const createFood = async (payload: {
  food_name: string;
  status: "Active" | "Inactive";
  faculty_id: number;
}): Promise<void> => {
  await axiosInstance.post("/teacher/food/create-food", payload);
};

// ✏️ แก้ไขอาหาร (ไม่ใช้ DTO)
export const updateFood = async (payload: Food): Promise<void> => {
  await axiosInstance.put(
    `/teacher/food/update-food/${payload.food_id}`,
    payload
  );
};

// 🗑️ ลบอาหาร
export const deleteFood = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/teacher/food/delete-food/${id}`);
};

// 🔍 ค้นหาอาหาร
export const searchFoods = async (keyword: string): Promise<ApiFood[]> => {
  const response = await axiosInstance.get<ApiFood[]>(
    `/teacher/food/search?name=${encodeURIComponent(keyword)}`
  );
  return response.data;
};

const foodService = {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  searchFoods,
};

export default foodService;
