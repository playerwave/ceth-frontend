// // src/store/food.store.ts
// import { create } from "zustand";
// import { Food } from "../../types/model";
// import foodService from "../../service/Teacher/food.service.teacher";
// import { mapApiToFoods } from "../mapper/foodMapper";

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
//   food?: Food | null;

//   setMockFoods?: (foods: Food[]) => void;
//   searchFoods?: (name: string) => Promise<void>;
//   searchResults?: Food[] | null;
// }

// export const useFoodStore = create<FoodStore>((set, get) => ({
//   foods: [],
//   selectedFood: null,
//   loading: false,
//   error: null,
//   foodLoading: false,
//   foodError: null,
//   food: null,
//   searchResults: null,

//   // 🔄 ดึงรายการอาหารทั้งหมด
//   fetchFoods: async () => {
//     set({ loading: true, error: null });
//     try {
//       const foods = await foodService.getAllFoods(); // ดึงแบบมี pagination ก็ได้
//       set({ foods });
//     } catch (err) {
//       set({ error: "Failed to fetch foods" });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // 📥 เลือกอาหารตาม ID
//   selectFood: async (id: number) => {
//     set({ loading: true });
//     try {
//       const food = await foodService.getFoodById(id);
//       set({ selectedFood: food });
//     } catch {
//       set({ error: "ไม่สามารถโหลดข้อมูลอาหารนี้ได้" });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // ❌ เคลียร์ข้อมูลอาหารที่เลือก
//   clearSelectedFood: () => set({ selectedFood: null }),

//   // ➕ สร้างอาหารใหม่
//   createFood: async (data) => {
//     set({ loading: true, error: null });
//     try {
//       await foodService.createFood(data);
//       const updatedList = await foodService.getAllFoods();
//       set({ foods: updatedList });
//     } catch {
//       set({ error: "ไม่สามารถเพิ่มอาหารได้" });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // ✏️ แก้ไขข้อมูลอาหาร
//   updateFood: async (data) => {
//     try {
//       await foodService.updateFood(data);
//       await get().fetchFoods();
//     } catch {
//       console.error("❌ Error updating food");
//     }
//   },

//   // 🗑️ ลบข้อมูลอาหาร
//   deleteFood: async (id) => {
//     try {
//       await foodService.deleteFood(id);
//       await get().fetchFoods();
//     } catch {
//       console.error("❌ Error deleting food");
//     }
//   },

//   // 🔍 ค้นหารายการอาหารตามชื่อ
//   searchFoods: async (name: string) => {
//     if (!name.trim()) {
//       await get().fetchFoods();
//       set({ searchResults: null });
//       return;
//     }

//     set({ foodLoading: true, foodError: null });
//     try {
//       const results = await foodService.searchFoods(name);
//       set({ searchResults: results });
//     } catch {
//       set({ foodError: "ไม่สามารถค้นหาอาหารได้" });
//     } finally {
//       set({ foodLoading: false });
//     }
//   },

//   // 🧪 ใช้สำหรับ mock test
//   setMockFoods: (foods) => set({ foods }),
// }));

// src/store/food.store.ts
import { create } from "zustand";
import { Food } from "../../types/model";
import foodService from "../../service/Teacher/food.service";
import { mapApiToFoods, mapApiToFood } from "../mapper/food.mapper";
import { FoodState } from "../state/food.state";

interface FoodStore {
  foods: Food[];
  selectedFood: Food | null;
  loading: boolean;
  error: string | null;

  fetchFoods: () => Promise<void>;
  selectFood: (id: number) => Promise<void>;
  clearSelectedFood: () => void;

  createFood: (data: Partial<Food>) => Promise<void>;
  updateFood: (data: Food) => Promise<void>;
  deleteFood: (id: number) => Promise<void>;

  foodLoading?: boolean;
  foodError?: string | null;

  setMockFoods?: (foods: Food[]) => void;
  searchFoods?: (name: string) => Promise<void>;
  searchResults?: Food[] | null;
}

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

  // 🔄 ดึงรายการอาหารทั้งหมด
  //   fetchFoods: async () => {
  //     set({ foodLoading: true, foodError: null });
  //     try {
  //       const apiFoods = await foodService.getAllFoods();
  //       const mapped = mapApiToFoods(apiFoods);
  //       set({ foods: mapped });

  //       console.log("📥 Fetched foods:", mapped);
  //     } catch (err) {
  //       set({ foodError: "Failed to fetch foods" });
  //     } finally {
  //       set({ foodLoading: false });
  //     }
  //   },

  fetchFoods: async () => {
    set({ foodLoading: true, foodError: null });
    try {
      const apiFoods = await foodService.getAllFoods();
      console.log("✅ apiFoods:", apiFoods);
      const mapped = mapApiToFoods(apiFoods);
      console.log("✅ mapped:", mapped);
      set({ foods: mapped });
    } catch (err) {
      console.error("❌ fetchFoods error:", err);
      set({ foodError: "Failed to fetch foods" });
    } finally {
      set({ foodLoading: false });
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
  //   createFood: async (data) => {
  //     set({ foodLoading: true, foodError: null });
  //     try {
  //       await foodService.createFood(data);
  //       await get().fetchFoods();
  //     } catch {
  //       set({ foodError: "ไม่สามารถเพิ่มอาหารได้" });
  //     } finally {
  //       set({ foodLoading: false });
  //     }
  //   },

  createFood: async (data: Partial<Food>) => {
    const { food_name, status, faculty_id } = data;

    if (!food_name || !status || !faculty_id) {
      set({ foodError: "ข้อมูลไม่ครบ ไม่สามารถสร้างอาหารได้" });
      return;
    }

    await foodService.createFood({ food_name, status, faculty_id });
    await get().fetchFoods();
  },

  // ✏️ แก้ไขข้อมูลอาหาร
  updateFood: async (data) => {
    try {
      await foodService.updateFood(data);
      await get().fetchFoods();
    } catch {
      console.error("❌ Error updating food");
    }
  },

  // 🗑️ ลบข้อมูลอาหาร
  deleteFood: async (id) => {
    try {
      await foodService.deleteFood(id);
      await get().fetchFoods();
    } catch {
      console.error("❌ Error deleting food");
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
