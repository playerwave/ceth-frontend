import { Food } from "../../types/model";

export interface FoodState {
  foods: Food[];
  searchResults: Food[] | null;
  foodError: string | null;
  foodLoading: boolean;
  selectedFood: Food | null;
  recommendedFoodIds: number[];
  enrolledFoods: Food[]; // ถ้าอาหารถูกผูกกับกิจกรรม/ผู้ใช้

  // ✅ เพิ่ม cache state
  lastFetched: number | null;
  cacheExpiry: number;
  isInitialized: boolean;

  // ฟังก์ชันหลักที่ใช้ใน store
  fetchFoods: () => Promise<void>;
  searchFoods: (searchName: string) => Promise<void>;
  fetchFoodById: (id: number) => Promise<Food | null>;

  // ✅ เพิ่มฟังก์ชัน cache
  initializeData: () => Promise<void>;
  refreshData: () => Promise<void>;
  invalidateCache: () => void;
  isCacheValid: () => boolean;

  // เพิ่มเติมถ้าระบบรองรับการจัดการ
  createFood?: (data: Partial<Food>) => Promise<void>;
  updateFood?: (data: Food) => Promise<void>;
  deleteFood?: (id: number) => Promise<void>;
  clearSelectedFood?: () => void;
}
