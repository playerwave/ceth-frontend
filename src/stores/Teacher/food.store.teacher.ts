// src/store/food.store.ts
import { create } from "zustand";
import { Food } from "@/types/food.type";
import foodService from "@/service/Teacher/food.service";
import { mapApiToFoods, mapApiToFood } from "../mapper/food.mapper";
import { FoodState } from "../state/food.state";

// interface FoodStore {
//   foods: Food[];
//   selectedFood: Food | null;
//   loading: boolean;
//   error: string | null;

//   fetchFoods: () => Promise<void>;
//   selectFood: (id: number) => Promise<void>;
//   clearSelectedFood: () => void;

//   createFood: (data: Partial<Food>) => Promise<void>;
//   updateFood: (data: Food) => Promise<void>;
//   deleteFood: (id: number) => Promise<void>;

//   foodLoading?: boolean;
//   foodError?: string | null;

//   setMockFoods?: (foods: Food[]) => void;
//   searchFoods?: (name: string) => Promise<void>;
//   searchResults?: Food[] | null;

//   // ✅ เพิ่ม cache state
//   lastFetched: number | null;
//   cacheExpiry: number; // 5 minutes
//   isInitialized: boolean;

//   // ✅ เพิ่มฟังก์ชันใหม่
//   initializeData: () => Promise<void>;
//   refreshData: () => Promise<void>;
//   invalidateCache: () => void;
//   isCacheValid: () => boolean;
// }

export const useFoodStore = create<FoodState>((set, get) => ({
  foods: [],
  selectedFood: null,
  loading: false,
  error: null,
  foodLoading: false,
  foodError: null,
  searchResults: null,
  recommendedFoodIds: [],
  enrolledFoods: [],

  // ✅ cache state
  lastFetched: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes
  isInitialized: false,

  // ✅ ตรวจสอบ cache validity
  isCacheValid: () => {
    const { lastFetched, cacheExpiry } = get();
    return !!(lastFetched && Date.now() - lastFetched < cacheExpiry);
  },

  // ✅ invalidate cache
  invalidateCache: () => {
    set({ lastFetched: null, isInitialized: false });
  },

  // ✅ โหลดข้อมูลทั้งหมดพร้อมกัน
  initializeData: async () => {
    const { isInitialized, isCacheValid } = get();

    // ถ้าเคยโหลดแล้วและ cache ยังไม่หมดอายุ ให้ข้าม
    if (isInitialized && isCacheValid()) {
      return;
    }

    set({ foodLoading: true, foodError: null });

    try {
      const apiFoods = await foodService.getAllFoods();
      console.log("✅ apiFoods:", apiFoods);
      const mapped = mapApiToFoods(apiFoods);
      console.log("✅ mapped:", mapped);

      set({
        foods: mapped,
        lastFetched: Date.now(),
        isInitialized: true,
        foodLoading: false,
      });
    } catch (error) {
      console.error("❌ Error initializing data:", error);
      set({
        foodError: "ไม่สามารถโหลดข้อมูลได้",
        foodLoading: false,
      });
    }
  },

  // ✅ refresh ข้อมูลทั้งหมด
  refreshData: async () => {
    set({ foodLoading: true, foodError: null });

    try {
      const apiFoods = await foodService.getAllFoods();
      const mapped = mapApiToFoods(apiFoods);

      set({
        foods: mapped,
        lastFetched: Date.now(),
        foodLoading: false,
      });
    } catch (error) {
      console.error("❌ Error refreshing data:", error);
      set({
        foodError: "ไม่สามารถรีเฟรชข้อมูลได้",
        foodLoading: false,
      });
    }
  },

  fetchFoods: async () => {
    // ✅ ใช้ cache ถ้ามี
    if (get().isCacheValid()) {
      return;
    }

    set({ foodLoading: true, foodError: null });
    try {
      const apiFoods = await foodService.getAllFoods();
      console.log("✅ apiFoods:", apiFoods);
      const mapped = mapApiToFoods(apiFoods);
      console.log("✅ mapped:", mapped);
      set({
        foods: mapped,
        lastFetched: Date.now(),
        foodLoading: false,
      });
    } catch (err) {
      console.error("❌ fetchFoods error:", err);
      set({ foodError: "Failed to fetch foods", foodLoading: false });
    }
  },

  fetchFoodById: async (id: number) => {
    try {
      const apiFood = await foodService.getFoodById(id);
      return mapApiToFood(apiFood);
    } catch {
      return null;
    }
  },

  // 📥 เลือกอาหารตาม ID
  selectFood: async (id: number) => {
    set({ foodLoading: true });
    try {
      const apiFood = await foodService.getFoodById(id);
      const mapped = mapApiToFood(apiFood);
      set({ selectedFood: mapped });
    } catch {
      set({ foodError: "ไม่สามารถโหลดข้อมูลอาหารนี้ได้" });
    } finally {
      set({ foodLoading: false });
    }
  },

  // ❌ เคลียร์ข้อมูลอาหารที่เลือก
  clearSelectedFood: () => set({ selectedFood: null }),

  // ➕ สร้างอาหารใหม่
  createFood: async (data: Partial<Food>) => {
    set({ foodLoading: true, foodError: null });
    try {
      const { food_name, status, faculty_id } = data;

      if (!food_name || !status || !faculty_id) {
        set({ foodError: "ข้อมูลไม่ครบ ไม่สามารถสร้างอาหารได้" });
        return;
      }

      await foodService.createFood({ food_name, status, faculty_id });
      // ✅ invalidate cache และ refresh ข้อมูลหลังจากสร้าง
      get().invalidateCache();
      await get().refreshData();
    } catch (error) {
      console.error("❌ Error creating food:", error);
      set({ foodError: "ไม่สามารถสร้างอาหารได้", foodLoading: false });
    }
  },

  // ✏️ แก้ไขข้อมูลอาหาร
  updateFood: async (food: Food) => {
    set({ foodLoading: true, foodError: null });
    try {
      await foodService.updateFood(food);
      // ✅ invalidate cache และ refresh ข้อมูลหลังจากอัปเดต
      get().invalidateCache();
      await get().refreshData();
    } catch (error) {
      console.error("❌ Error updating food:", error);
      set({ foodError: "ไม่สามารถอัปเดตอาหารได้", foodLoading: false });
    }
  },

  // 🗑️ ลบข้อมูลอาหาร
  deleteFood: async (id) => {
    set({ foodLoading: true, foodError: null });
    try {
      await foodService.deleteFood(id);
      // ✅ invalidate cache และ refresh ข้อมูลหลังจากลบ
      get().invalidateCache();
      await get().refreshData();
    } catch (error) {
      console.error("❌ Error deleting food:", error);
      set({ foodError: "ไม่สามารถลบอาหารได้", foodLoading: false });
    }
  },

  // 🔍 ค้นหารายการอาหารตามชื่อ
  searchFoods: async (name: string) => {
    if (!name.trim()) {
      await get().fetchFoods();
      set({ searchResults: null });
      return;
    }

    set({ foodLoading: true, foodError: null });
    try {
      const apiFoods = await foodService.searchFoods(name);
      const mapped = mapApiToFoods(apiFoods);
      set({ searchResults: mapped });
    } catch {
      set({ foodError: "ไม่สามารถค้นหาอาหารได้" });
    } finally {
      set({ foodLoading: false });
    }
  },

  // 🧪 ใช้สำหรับ mock test
  setMockFoods: (foods: Food[]) => {
    set({ foods });
  },
}));
