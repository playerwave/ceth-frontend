import axiosInstance from "@/libs/axios";

const TEACHER_USER_MANAGEMENT_PATH = "/teacher/user-management";

export interface UploadReviewResult {
  totalRecords: number;
  duplicateRecords: number;
  newRecords: number;
  duplicateDetails: {
    username: string;
    existingUser: any;
    newUser: any;
  }[];
  newUserDetails: any[];
  summary: {
    duplicatesPercentage: number;
    newRecordsPercentage: number;
  };
}

/**
 * ตรวจสอบข้อมูลที่จะอัปโหลดและสร้าง review report
 */
export const reviewUploadData = async (file: File): Promise<UploadReviewResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
      data: UploadReviewResult;
    }>(`${TEACHER_USER_MANAGEMENT_PATH}/review-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data || !response.data.success || !response.data.data) {
      throw new Error("Invalid response structure from API");
    }

    console.log("✅ Upload review completed:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("❌ Error reviewing upload data:", error);
    throw error;
  }
};

/**
 * ดึง username ทั้งหมดที่มีอยู่ในระบบ
 */
export const getAllExistingUsernames = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get<{
      success: boolean;
      message: string;
      data: string[];
    }>(`${TEACHER_USER_MANAGEMENT_PATH}/existing-usernames`);

    if (!response.data || !response.data.success || !Array.isArray(response.data.data)) {
      console.warn("⚠️ Invalid response structure from API:", response.data);
      return [];
    }

    console.log(`✅ Retrieved ${response.data.data.length} existing usernames`);
    return response.data.data;
  } catch (error) {
    console.error("❌ Error getting existing usernames:", error);
    throw error;
  }
};

const uploadReviewService = {
  reviewUploadData,
  getAllExistingUsernames,
};

export default uploadReviewService;
