import { create } from "zustand";
import axiosInstance from "../../libs/axios";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
}

// comment
interface UserState {
  users: User[];
  error: string | null;
  isLoading: boolean;
  message: string | null;
  fetchUsers: () => Promise<User[]>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  error: null,
  isLoading: false,
  message: null,

  fetchUsers: async () => {
    set(() => ({ isLoading: true, error: null }));

    try {
      const { data } = await axiosInstance.get<User[]>(`/user/users`);

      // Log ค่า data ทั้งหมดเพื่อดูว่าโครงสร้างมันเป็นอย่างไร
      console.log("Data fetched from API:", data);

      // ตรวจสอบว่า data เป็น array และมีข้อมูล
      if (Array.isArray(data)) {
        if (data.length === 0) {
          set(() => ({ users: [], isLoading: false }));
          console.log("No users found");
          return [];
        } else {
          set(() => ({ users: data, isLoading: false }));
          console.log("Users fetched:", data);
          return data;
        }
      } else {
        set(() => ({ users: [], isLoading: false }));
        console.log("Invalid response format, data is not an array:", data);
        return [];
      }
    } catch (error: any) {
      set(() => ({
        error: error.response?.data?.message || "Error fetching Users",
        isLoading: false,
      }));
      console.log("Error fetching users:", error);
      return [];
    }
  },
  createUser: async (user) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      await axiosInstance.post(`/user/create-user`, user);
      set((state) => ({ users: [...state.users, user], isLoading: false }));
    } catch (error: any) {
      set(() => ({
        error: error.response?.data?.message || "Error creating User",
        isLoading: false,
      }));
    }
  },
  updateUser: async (user) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      await axiosInstance.put(`/user/update-user/${user.id}`, user);
      set((state) => ({
        users: state.users.map((u) => (u.id === user.id ? user : u)),
        isLoading: false,
      }));
    } catch (error: any) {
      set(() => ({
        error: error.response?.data?.message || "Error updating User",
        isLoading: false,
      }));
    }
  },

  deleteUser: async (id) => {
    set(() => ({ isLoading: true, error: null }));
    try {
      await axiosInstance.delete(`/user/delete-user/${id}`);
      set((state) => ({ users: [...state.users, user], isLoading: false }));
    } catch (error: any) {
      set(() => ({
        error: error.response?.data?.message || "Error deleting User",
        isLoading: false,
      }));
    }
  },
}));
