import axiosInstance from "../../libs/axios";

interface QRCodeToken {
  token: string;
  activityId: number;
  expiresAt: Date;
  createdAt: Date;
}

interface QRCodeResponse {
  qrCodeUrl: string;
  token: string;
  expiresAt: Date;
}

//--------------------- Generate QR Code with Token -------------------------
export const generateQRCodeWithToken = async (activityId: number): Promise<QRCodeResponse> => {
  try {
    const response = await axiosInstance.post<QRCodeResponse>(
      `/teacher/qr-code/generate/${activityId}`
    );
    
    console.log("🔐 Generated QR Code with token:", {
      activityId,
      token: response.data.token,
      expiresAt: response.data.expiresAt
    });
    
    return response.data;
  } catch (error) {
    console.error("❌ Error generating QR code:", error);
    throw error;
  }
};
//----------------------------------------------------------------

//--------------------- Validate QR Code Token -------------------------
export const validateQRCodeToken = async (token: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.post<{ valid: boolean }>(
      `/teacher/qr-code/validate`,
      { token }
    );
    
    console.log("🔍 Token validation result:", response.data.valid);
    return response.data.valid;
  } catch (error) {
    console.error("❌ Error validating token:", error);
    return false;
  }
};
//----------------------------------------------------------------

//--------------------- Get QR Code Status -------------------------
export const getQRCodeStatus = async (activityId: number): Promise<{
  isActive: boolean;
  currentToken: string;
  expiresAt: Date;
}> => {
  try {
    const response = await axiosInstance.get(
      `/teacher/qr-code/status/${activityId}`
    );
    
    return response.data;
  } catch (error) {
    console.error("❌ Error getting QR code status:", error);
    throw error;
  }
};
//----------------------------------------------------------------

//--------------------- Revoke QR Code Token -------------------------
export const revokeQRCodeToken = async (activityId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/teacher/qr-code/revoke/${activityId}`);
    console.log("🗑️ QR Code token revoked for activity:", activityId);
  } catch (error) {
    console.error("❌ Error revoking QR code token:", error);
    throw error;
  }
};
//----------------------------------------------------------------

const qrCodeService = {
  generateQRCodeWithToken,
  validateQRCodeToken,
  getQRCodeStatus,
  revokeQRCodeToken,
};

export default qrCodeService;
