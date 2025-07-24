import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "../state/auth.state";
import authService from "../../service/Visitor/auth.service";
import { mapApiToAuthUser, mapUserToAuthUser } from "../mapper/auth.mapper";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      authLoading: false,
      authError: null,

      login: async ({ username, password }) => {
        set({ authLoading: true, authError: null });

        try {
          const apiUser = await authService.login({ username, password });
          const authUser = mapApiToAuthUser(apiUser);
          set({ user: authUser, isAuthenticated: true });

          // ✅ ตอนนี้ get() ไม่ error แล้ว
          await get().fetchMe();
        } catch (error) {
          console.error("Login error:", error);
          set({ authError: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        } finally {
          set({ authLoading: false });
        }
      },

      logout: async () => {
        try {
          await authService.logout(); // ✅ backend: เคลียร์ session + cookie
        } catch (err) {
          console.error("Logout failed:", err);
        }
        set({ user: null, isAuthenticated: false }); // ✅ frontend: เคลียร์ state
      },

      // fetchMe: async () => {
      //   set({ authLoading: true, authError: null });
      //   try {
      //     const user = await authService.fetchMe();
      //     const authUser = mapUserToAuthUser(user);
      //     set({ user: authUser, isAuthenticated: true });
      //   } catch (error) {
      //     console.error("FetchMe error:", error);
      //     set({ user: null, isAuthenticated: false });
      //   } finally {
      //     set({ authLoading: false });
      //   }
      // },

      fetchMe: async () => {
        set({ authLoading: true, authError: null });
        try {
          const user = await authService.fetchMe();
          const authUser = mapUserToAuthUser(user);
          set({ user: authUser, isAuthenticated: true });
        } catch (error) {
          console.error("FetchMe error:", error);

          // 🔧 เพิ่ม fallback user แบบ Visitor หากโหลดไม่สำเร็จ
          set({
            user: {
              userId: 0,
              username: "guest",
              role: {
                roles_id: 0,
                role_name: "Visitor",
              },
              role_id: 0,
              token: "",
            },
            isAuthenticated: false,
          });
        } finally {
          set({ authLoading: false });
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
