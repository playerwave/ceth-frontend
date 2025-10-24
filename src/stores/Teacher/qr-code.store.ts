import { create } from "zustand";
import qrCodeService from "@/service/Teacher/qr-code.service";

interface QRCodeState {
  qrCodeUrl: string | null;
  expiresAt: Date | null;
  isActive: boolean;
  loading: boolean;
  error: string | null;
  autoRefreshInterval: number | null;
  
  // Actions
  generateQRCode: (activityId: number) => Promise<void>;
  resetQRCode: (activityId: number) => Promise<void>;
  validateToken: (token: string) => Promise<boolean>;
  getQRCodeStatus: (activityId: number) => Promise<void>;
  revokeToken: (activityId: number) => Promise<void>;
  startAutoRefresh: (activityId: number) => void;
  stopAutoRefresh: () => void;
  clearError: () => void;
}

export const useQRCodeStore = create<QRCodeState>((set, get) => ({
  qrCodeUrl: null,
  expiresAt: null,
  isActive: false,
  loading: false,
  error: null,
  autoRefreshInterval: null,

  //--------------------- Generate QR Code -------------------------
  generateQRCode: async (activityId: number) => {
    console.log("🔐 Generating QR Code for activity:", activityId);
    set({ loading: true, error: null });

    try {
      // ✅ ตรวจสอบ token ก่อนเรียก API
      const token = localStorage.getItem('auth-token');
      if (!token) {
        console.log("❌ No auth token found - redirecting to login");
        set({ 
          error: "กรุณาเข้าสู่ระบบใหม่", 
          loading: false,
          isActive: false 
        });
        // ใช้ setTimeout เพื่อให้ UI update ก่อน redirect
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        return;
      }

      console.log("📞 Calling qrCodeService.generateQRCodeToken...");
      const result = await qrCodeService.generateQRCodeToken(activityId);
      console.log("📥 Service response:", result);
      
      if (!result || !result.qrCodeUrl) {
        throw new Error("Invalid response from service - missing qrCodeUrl");
      }
      
      set({
        qrCodeUrl: result.qrCodeUrl,
        expiresAt: new Date(result.expiresAt),
        isActive: true,
        loading: false,
      });

      console.log("✅ QR Code generated successfully:", result);
    } catch (error: any) {
      console.error("❌ Error generating QR Code:", error);
      console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      let errorMessage = "ไม่สามารถสร้าง QR Code ได้";
      let shouldRedirect = false;
      
      if (error.response?.status === 401) {
        errorMessage = "ไม่มีสิทธิ์เข้าถึง - กรุณาเข้าสู่ระบบใหม่";
        shouldRedirect = true;
      } else if (error.response?.status === 404) {
        errorMessage = "ไม่พบกิจกรรมนี้";
      } else if (error.response?.status === 500) {
        errorMessage = "เกิดข้อผิดพลาดในเซิร์ฟเวอร์";
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
      }
      
      set({
        error: errorMessage,
        loading: false,
        isActive: false,
      });

      // ✅ Redirect ไป login ถ้าจำเป็น
      if (shouldRedirect) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000); // รอ 2 วินาทีให้ user เห็น error message
      }
    }
  },
  //----------------------------------------------------------------

  //--------------------- Reset QR Code -------------------------
  resetQRCode: async (activityId: number) => {
    console.log("🔄 Resetting QR Code for activity:", activityId);
    set({ loading: true, error: null });

    try {
      // ✅ ตรวจสอบ token ก่อนเรียก API
      const token = localStorage.getItem('auth-token');
      if (!token) {
        console.log("❌ No auth token found - redirecting to login");
        set({ 
          error: "กรุณาเข้าสู่ระบบใหม่", 
          loading: false,
          isActive: false 
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        return;
      }

      // Call reset endpoint
      console.log("📞 Calling qrCodeService.resetQRCodeToken...");
      const result = await qrCodeService.resetQRCodeToken(activityId);
      console.log("📥 Service response:", result);
      
      if (!result || !result.qrCodeUrl) {
        throw new Error("Invalid response from service - missing qrCodeUrl");
      }
      
      // ✅ อัปเดต state ทันทีด้วยข้อมูลใหม่
      const newExpiresAt = new Date(result.expiresAt);
      set({
        qrCodeUrl: result.qrCodeUrl,
        expiresAt: newExpiresAt,
        isActive: true,
        loading: false,
      });

      console.log("✅ QR Code reset successfully:", {
        qrCodeUrl: result.qrCodeUrl,
        expiresAt: newExpiresAt,
        timeRemaining: `${Math.floor((newExpiresAt.getTime() - Date.now()) / 60000)}:${Math.floor(((newExpiresAt.getTime() - Date.now()) % 60000) / 1000).toString().padStart(2, '0')}`
      });
    } catch (error: any) {
      console.error("❌ Error resetting QR Code:", error);
      console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      let errorMessage = "ไม่สามารถรีเซ็ต QR Code ได้";
      let shouldRedirect = false;
      
      if (error.response?.status === 401) {
        errorMessage = "ไม่มีสิทธิ์เข้าถึง - กรุณาเข้าสู่ระบบใหม่";
        shouldRedirect = true;
      } else if (error.response?.status === 404) {
        errorMessage = "ไม่พบกิจกรรมนี้";
      } else if (error.response?.status === 500) {
        errorMessage = "เกิดข้อผิดพลาดในเซิร์ฟเวอร์";
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
      }
      
      set({
        error: errorMessage,
        loading: false,
        isActive: false,
      });

      // ✅ Redirect ไป login ถ้าจำเป็น
      if (shouldRedirect) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    }
  },
  //----------------------------------------------------------------

  //--------------------- Validate Token -------------------------
  validateToken: async (token: string): Promise<boolean> => {
    try {
      const result = await qrCodeService.validateToken(token);
      return result.valid;
    } catch (error) {
      console.error("❌ Error validating token:", error);
      return false;
    }
  },
  //----------------------------------------------------------------

  //--------------------- Get QR Code Status -------------------------
  getQRCodeStatus: async (activityId: number) => {
    try {
      const status = await qrCodeService.getQRCodeStatus(activityId);
      
      set({
        isActive: status.isActive,
        expiresAt: status.isActive ? new Date(status.expiresAt) : null,
      });
    } catch (error) {
      console.error("❌ Error getting QR Code status:", error);
      set({ error: "ไม่สามารถดึงสถานะ QR Code ได้" });
    }
  },
  //----------------------------------------------------------------

  //--------------------- Revoke Token -------------------------
  revokeToken: async (activityId: number) => {
    try {
      await qrCodeService.revokeToken(activityId);
      set({
        qrCodeUrl: null,
        expiresAt: null,
        isActive: false,
      });
      console.log("✅ Token revoked successfully");
    } catch (error) {
      console.error("❌ Error revoking token:", error);
      set({ error: "ไม่สามารถยกเลิก token ได้" });
    }
  },
  //----------------------------------------------------------------

  //--------------------- Start Auto Refresh -------------------------
  startAutoRefresh: (activityId: number) => {
    const { stopAutoRefresh, generateQRCode } = get();
    
    // หยุด auto refresh เดิมก่อน
    stopAutoRefresh();
    
    // เริ่ม auto refresh ใหม่
    const interval = setInterval(() => {
      console.log("🔄 Auto refreshing QR Code...");
      generateQRCode(activityId);
    }, 15000); // รีเฟรชทุก 15 วินาที
    
    set({ autoRefreshInterval: interval });
    console.log("✅ Auto refresh started");
  },
  //----------------------------------------------------------------

  //--------------------- Stop Auto Refresh -------------------------
  stopAutoRefresh: () => {
    const { autoRefreshInterval } = get();
    
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      set({ autoRefreshInterval: null });
      console.log("✅ Auto refresh stopped");
    }
  },
  //----------------------------------------------------------------

  //--------------------- Clear Error -------------------------
  clearError: () => {
    set({ error: null });
  },
  //----------------------------------------------------------------
}));
