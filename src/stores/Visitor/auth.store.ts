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

      // login: async ({ username, password }) => {
      //   set({ authLoading: true, authError: null });
      //   try {
      //     const apiUser = await authService.login({ username, password });
      //     const authUser = mapApiToAuthUser(apiUser);
      //     set({ user: authUser, isAuthenticated: true });

      //     await get().fetchMe(); // ✅ อัปเดต user จาก backend

      //     // ✅ ดึงใหม่หลัง fetchMe แล้ว redirect จากตรงนี้
      //     const freshUser = get().user;
      //     if (freshUser) {
      //       const navigateTo =
      //         freshUser.role_id === 1 || freshUser.role_id === 3
      //           ? "/"
      //           : freshUser.role_id === 2
      //             ? "/main-student"
      //             : "/activity-info-visitor";
      //       window.location.href = navigateTo; // ✅ force redirect (ปลอดภัยกว่า navigate() ตอน login)
      //     }
      //   } catch (error) {
      //     console.error("Login error:", error);
      //     set({ authError: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
      //   } finally {
      //     set({ authLoading: false });
      //   }
      // },

      logout: async () => {
        try {
          await authService.logout(); // ✅ backend: เคลียร์ session + cookie
        } catch (err) {
          console.error("Logout failed:", err);
        }
        set({ user: null, isAuthenticated: false }); // ✅ frontend: เคลียร์ state
      },

      fetchMe: async () => {
        set({ authLoading: true, authError: null });
        try {
          const user = await authService.fetchMe();
          const authUser = mapUserToAuthUser(user);
          set({ user: authUser, isAuthenticated: true });
        } catch (error) {
          console.error("FetchMe error:", error);
          set({ user: null, isAuthenticated: false });
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
