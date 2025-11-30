import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, UpdatePasswordPayload, SendForgotPasswordCodePayload, VerifyForgotPasswordCodePayload } from "../state/auth.state";
import authService from "../../service/Visitor/auth.service";
import { mapApiToAuthUser, mapUserToAuthUser } from "../mapper/auth.mapper";

// ✅ Global flag เพื่อป้องกันการเรียก fetchMe ซ้ำ (ใช้ร่วมกันทุก component)
let _isFetchingMe = false;
let _lastFetchTime = 0;
const FETCH_ME_DEBOUNCE_MS = 2000; // ✅ หน่วงเวลา 2 วินาทีระหว่างการเรียก

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
          // ✅ Reset flag หลัง login สำเร็จ
          _isFetchingMe = false;
          _lastFetchTime = Date.now();
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
        // ✅ Reset flag หลัง logout
        _isFetchingMe = false;
        _lastFetchTime = 0;
      },

      fetchMe: async () => {
        const state = get();
        const now = Date.now();
        
        // ✅ ป้องกันการเรียก fetchMe ซ้ำ (รวมถึงตอน error)
        if (state.authLoading || _isFetchingMe) {
          console.log("⏳ [Auth Store] Already fetching, skipping...");
          return;
        }
        
        // ✅ Debounce: ป้องกันการเรียกซ้ำเร็วเกินไป (ภายใน 2 วินาที)
        if (now - _lastFetchTime < FETCH_ME_DEBOUNCE_MS) {
          console.log(`⏳ [Auth Store] Debounce: Too soon since last fetch (${now - _lastFetchTime}ms), skipping...`);
          return;
        }
        
        console.log("🔄 [Auth Store] Starting fetchMe...");
        _isFetchingMe = true;
        _lastFetchTime = now;
        set({ authLoading: true, authError: null });
        
        try {
          const user = await authService.fetchMe();
          const authUser = mapUserToAuthUser(user);
          set({ user: authUser, isAuthenticated: true, authError: null });
          console.log("✅ [Auth Store] fetchMe completed successfully");
        } catch (error: any) {
          console.error("❌ [Auth Store] FetchMe error:", error);
          
          // ✅ ตรวจสอบประเภทของ error
          const errorMessage = error?.response?.data?.error || error?.message || "Unknown error";
          const statusCode = error?.response?.status;
          
          if (errorMessage === "No token found in localStorage" || statusCode === 401) {
            // Token ไม่มีหรือหมดอายุ → ไม่ redirect ไป login (เพราะอาจเป็น error ชั่วคราว)
            console.log("🔍 [Auth Store] Authentication error - clearing user but not redirecting");
            set({ user: null, isAuthenticated: false, authError: null });
          } else if (statusCode === 404) {
            // User not found → ไม่ retry (ป้องกัน infinite loop)
            console.log("🔍 [Auth Store] User not found (404) - stopping retry");
            set({ user: null, isAuthenticated: false, authError: "ไม่พบข้อมูลผู้ใช้" });
          } else {
            // Error อื่นๆ → แสดง error message แต่ไม่ retry
            console.log("🔍 [Auth Store] Other error:", errorMessage);
            set({ authError: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้" });
          }
        } finally {
          set({ authLoading: false });
          // ✅ Reset flag หลังเสร็จ (หน่วงเวลาเล็กน้อยเพื่อป้องกันการเรียกซ้ำทันที)
          setTimeout(() => {
            _isFetchingMe = false;
          }, 500);
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

      sendForgotPasswordCode: async ({ email }: SendForgotPasswordCodePayload) => {
        set({ authLoading: true, authError: null });
        
        try {
          const result = await authService.sendForgotPasswordCode({ email });
          console.log("✅ [Auth Store] Forgot password code sent successfully");
          return result;
        } catch (error) {
          console.error("❌ [Auth Store] Send forgot password code error:", error);
          const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการส่งรหัสยืนยัน";
          set({ authError: errorMessage });
          return { success: false, message: errorMessage };
        } finally {
          set({ authLoading: false });
        }
      },

      verifyForgotPasswordCode: async ({ email, code, newPassword }: VerifyForgotPasswordCodePayload) => {
        set({ authLoading: true, authError: null });
        
        try {
          const result = await authService.verifyForgotPasswordCode({ email, code, newPassword });
          console.log("✅ [Auth Store] Forgot password code verified successfully");
          return result;
        } catch (error) {
          console.error("❌ [Auth Store] Verify forgot password code error:", error);
          const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการยืนยันรหัส";
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
