import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, UpdatePasswordPayload } from "../state/auth.state";
import authService from "../../service/Visitor/auth.service";
import { mapApiToAuthUser, mapUserToAuthUser } from "../mapper/auth.mapper";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      authLoading: false,
      authError: null,
      _isFetching: false, // เพิ่ม flag เพื่อป้องกันการเรียก fetchMe ซ้ำ

      login: async ({ username, password }) => {
        set({ authLoading: true, authError: null });

        try {
          const apiUser = await authService.login({ username, password });
          const authUser = mapApiToAuthUser(apiUser);
          set({ user: authUser, isAuthenticated: true });
          // ลบ fetchMe ออกเพราะ login response มีข้อมูลครบแล้ว
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
        const state = get();
        
        // ป้องกันการเรียก fetchMe ซ้ำ
        if (state.authLoading) {
          console.log("⏳ [Auth Store] Already fetching, skipping...");
          return;
        }
        
        console.log("🔄 [Auth Store] Starting fetchMe...");
        set({ authLoading: true, authError: null });
        
        try {
          const user = await authService.fetchMe();
          const authUser = mapUserToAuthUser(user);
          set({ user: authUser, isAuthenticated: true, authError: null });
          console.log("✅ [Auth Store] fetchMe completed successfully");
        } catch (error) {
          console.error("❌ [Auth Store] FetchMe error:", error);
          
          // ✅ ตรวจสอบประเภทของ error
          if (error instanceof Error && error.message === "No token found in localStorage") {
            // Token ไม่มีใน localStorage → ไม่ redirect ไป login
            console.log("🔍 [Auth Store] No token found - not redirecting to login");
            set({ user: null, isAuthenticated: false, authError: null });
          } else {
            // Error อื่นๆ → แสดง error message
            console.log("🔍 [Auth Store] Other error:", error);
            set({ authError: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้" });
          }
        } finally {
          set({ authLoading: false });
        }
      },

      updatePassword: async ({ newPassword }: UpdatePasswordPayload) => {
        set({ authLoading: true, authError: null });
        
        try {
          const result = await authService.updatePassword({ newPassword });
          console.log("✅ [Auth Store] Password updated successfully");
          return result;
        } catch (error) {
          console.error("❌ [Auth Store] Update password error:", error);
          const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอัปเดตรหัสผ่าน";
          set({ authError: errorMessage });
          return { success: false, message: errorMessage };
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
