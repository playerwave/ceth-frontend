import { create } from "zustand";
import qrCodeService from "../../service/Teacher/qr-code.service";

interface QRCodeState {
  currentToken: string;
  qrCodeUrl: string;
  expiresAt: Date | null;
  isActive: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  generateQRCode: (activityId: number) => Promise<void>;
  refreshQRCode: (activityId: number) => Promise<void>;
  validateToken: (token: string) => Promise<boolean>;
  revokeToken: (activityId: number) => Promise<void>;
  startAutoRefresh: (activityId: number) => void;
  stopAutoRefresh: () => void;
}

export const useQRCodeStore = create<QRCodeState>((set, get) => ({
  currentToken: "",
  qrCodeUrl: "",
  expiresAt: null,
  isActive: false,
  loading: false,
  error: null,
  
  //--------------------- Generate QR Code -------------------------
  generateQRCode: async (activityId: number) => {
    console.log("🔐 Generating QR Code for activity:", activityId);
    set({ loading: true, error: null });
    
    try {
      const response = await qrCodeService.generateQRCodeWithToken(activityId);
      
      set({
        currentToken: response.token,
        qrCodeUrl: response.qrCodeUrl,
        expiresAt: new Date(response.expiresAt),
        isActive: true,
        loading: false,
      });
      
      console.log("✅ QR Code generated successfully:", {
        token: response.token,
        expiresAt: response.expiresAt
      });
    } catch (error) {
      console.error("❌ Error generating QR Code:", error);
      set({ 
        error: "ไม่สามารถสร้าง QR Code ได้", 
        loading: false 
      });
    }
  },
  //----------------------------------------------------------------

  //--------------------- Refresh QR Code -------------------------
  refreshQRCode: async (activityId: number) => {
    console.log("🔄 Refreshing QR Code for activity:", activityId);
    
    try {
      // Revoke current token first
      if (get().currentToken) {
        await qrCodeService.revokeQRCodeToken(activityId);
      }
      
      // Generate new QR Code
      await get().generateQRCode(activityId);
      
      console.log("✅ QR Code refreshed successfully");
    } catch (error) {
      console.error("❌ Error refreshing QR Code:", error);
      set({ error: "ไม่สามารถรีเฟรช QR Code ได้" });
    }
  },
  //----------------------------------------------------------------

  //--------------------- Validate Token -------------------------
  validateToken: async (token: string): Promise<boolean> => {
    console.log("🔍 Validating token:", token);
    
    try {
      const isValid = await qrCodeService.validateQRCodeToken(token);
      console.log("✅ Token validation result:", isValid);
      return isValid;
    } catch (error) {
      console.error("❌ Error validating token:", error);
      return false;
    }
  },
  //----------------------------------------------------------------

  //--------------------- Revoke Token -------------------------
  revokeToken: async (activityId: number) => {
    console.log("🗑️ Revoking token for activity:", activityId);
    
    try {
      await qrCodeService.revokeQRCodeToken(activityId);
      set({
        currentToken: "",
        qrCodeUrl: "",
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
    console.log("🔄 Starting auto refresh for activity:", activityId);
    
    // Clear existing interval
    const existingInterval = (window as any).qrCodeRefreshInterval;
    if (existingInterval) {
      clearInterval(existingInterval);
    }
    
    // Set new interval - refresh every 15 seconds
    const interval = setInterval(async () => {
      console.log("🔄 Auto refreshing QR Code...");
      await get().refreshQRCode(activityId);
    }, 15000); // 15 seconds
    
    // Store interval ID
    (window as any).qrCodeRefreshInterval = interval;
    
    console.log("✅ Auto refresh started - will refresh every 15 seconds");
  },
  //----------------------------------------------------------------

  //--------------------- Stop Auto Refresh -------------------------
  stopAutoRefresh: () => {
    console.log("🛑 Stopping auto refresh");
    
    const interval = (window as any).qrCodeRefreshInterval;
    if (interval) {
      clearInterval(interval);
      (window as any).qrCodeRefreshInterval = null;
      console.log("✅ Auto refresh stopped");
    }
  },
  //----------------------------------------------------------------
}));
