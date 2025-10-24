import axiosInstance from "@/libs/axios";

// Base path
const QR_CODE_PATH = "/teacher/qr-code";

//--------------------- Generate QR Code Token -------------------------
export const generateQRCodeToken = async (activityId: number) => {
  console.log("🔐 Service: Generating QR Code token for activity:", activityId);
  console.log("🔐 Service: API URL:", `${QR_CODE_PATH}/generate/${activityId}`);
  console.log("🔐 Service: Base URL:", axiosInstance.defaults.baseURL);
  
  try {
    const response = await axiosInstance.post(
      `${QR_CODE_PATH}/generate/${activityId}`
    );
    
    console.log("✅ Service: QR Code token generated:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Service: Error generating QR Code token:", error);
    console.error("❌ Service: Error response:", error.response?.data);
    console.error("❌ Service: Error status:", error.response?.status);
    console.error("❌ Service: Error config:", error.config);
    throw error;
  }
};
//----------------------------------------------------------------

//--------------------- Reset QR Code Token -------------------------
export const resetQRCodeToken = async (activityId: number) => {
  console.log("🔄 Service: Resetting QR Code token for activity:", activityId);
  console.log("🔄 Service: API URL:", `${QR_CODE_PATH}/reset/${activityId}`);
  console.log("🔄 Service: Base URL:", axiosInstance.defaults.baseURL);
  
  try {
    const response = await axiosInstance.post(
      `${QR_CODE_PATH}/reset/${activityId}`
    );
    
    console.log("✅ Service: QR Code token reset:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Service: Error resetting QR Code token:", error);
    console.error("❌ Service: Error response:", error.response?.data);
    console.error("❌ Service: Error status:", error.response?.status);
    console.error("❌ Service: Error config:", error.config);
    throw error;
  }
};
//----------------------------------------------------------------

//--------------------- Validate Token -------------------------
export const validateToken = async (token: string) => {
  console.log("🔍 Service: Validating token:", token);
  
  const response = await axiosInstance.post(
    `${QR_CODE_PATH}/validate`,
    { token }
  );
  
  console.log("✅ Service: Token validation result:", response.data);
  return response.data;
};
//----------------------------------------------------------------

//--------------------- Get QR Code Status -------------------------
export const getQRCodeStatus = async (activityId: number) => {
  console.log("📊 Service: Getting QR Code status for activity:", activityId);
  
  const response = await axiosInstance.get(
    `${QR_CODE_PATH}/status/${activityId}`
  );
  
  console.log("✅ Service: QR Code status:", response.data);
  return response.data;
};
//----------------------------------------------------------------

//--------------------- Revoke Token -------------------------
export const revokeToken = async (activityId: number) => {
  console.log("🗑️ Service: Revoking token for activity:", activityId);
  
  const response = await axiosInstance.delete(
    `${QR_CODE_PATH}/revoke/${activityId}`
  );
  
  console.log("✅ Service: Token revoked:", response.data);
  return response.data;
};
//----------------------------------------------------------------

//--------------------- Cleanup Expired Tokens -------------------------
export const cleanupExpiredTokens = async () => {
  console.log("🧹 Service: Cleaning up expired tokens");
  
  const response = await axiosInstance.post(
    `${QR_CODE_PATH}/cleanup`
  );
  
  console.log("✅ Service: Expired tokens cleaned up:", response.data);
  return response.data;
};
//----------------------------------------------------------------

//--------------------- Export Service -----------------------------
const qrCodeService = {
  generateQRCodeToken,
  resetQRCodeToken,
  validateToken,
  getQRCodeStatus,
  revokeToken,
  cleanupExpiredTokens,
};
//------------------------------------------------------------------

export default qrCodeService;
