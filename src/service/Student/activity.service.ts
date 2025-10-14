import axiosInstance from "../../libs/axios";
import { Activity } from "../../types/model";

// base path
const STUDENT_ACTIVITY_PATH = "/student/activity";

//--------------------- Fetch Activities for a Student -------------------------
export const fetchActivities = async (studentId: number): Promise<Activity[]> => {
  console.log("🚀🚀🚀 [SERVICE] fetchActivities called with studentId:", studentId);
  console.log("🚀🚀🚀 [SERVICE] STUDENT_ACTIVITY_PATH:", STUDENT_ACTIVITY_PATH);
  console.log("🚀🚀🚀 [SERVICE] Full URL:", `${STUDENT_ACTIVITY_PATH}/get-student-activities/${studentId}`);
  
  try {
    console.log("🚀🚀🚀 [SERVICE] SENDING REQUEST NOW to /api/student/activity/get-student-activities/" + studentId);
    const response = await axiosInstance.get<Activity[]>(
      `${STUDENT_ACTIVITY_PATH}/get-student-activities/${studentId}`
    );
    
    console.log("✅✅✅ [SERVICE] Response received:", response.data);
    console.log("✅✅✅ [SERVICE] Response status:", response.status);
    
    // ตรวจสอบว่า response.data เป็น array ที่ถูกต้อง
    if (response.data && Array.isArray(response.data)) {
      console.log("✅ [SERVICE] Valid response data, count:", response.data.length);
      return response.data;
    } else {
      console.warn("⚠️ [SERVICE] Invalid response data:", response.data);
      return [];
    }
  } catch (error) {
    console.error("❌ [SERVICE] Error in fetchActivities:", error);
    throw error;
  }
};
//------------------------------------------------------------------------------

//--------------------- Search Activities --------------------------------------
export const searchActivities = async (
  searchName: string
): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>(
    `${STUDENT_ACTIVITY_PATH}/searchActivity?ac_name=${encodeURIComponent(searchName)}`
  );
  return response.data;
};
//-------------------------------------------------------------------------------

//--------------------- Fetch Enrolled Activities for a Student -------------------------
export const fetchEnrolledActivities = async (
  studentId: number
): Promise<Activity[]> => {
  console.log("🌐 [SERVICE] fetchEnrolledActivities called with studentId:", studentId);
  console.log("🌐 [SERVICE] Making request to:", `/student/activity/get-enrolled-activities/${studentId}`);
  console.log("🌐 [SERVICE] Full URL:", `${axiosInstance.defaults.baseURL}student/activity/get-enrolled-activities/${studentId}`);
  
  try {
    const response = await axiosInstance.get<Activity[]>(
      `/student/activity/get-enrolled-activities/${studentId}`
    );
    
    console.log("✅ [SERVICE] Enrolled activities response received:", response.data);
    console.log("✅ [SERVICE] Response status:", response.status);
    console.log("✅ [SERVICE] Response headers:", response.headers);
    
    // ตรวจสอบว่า response.data เป็น array ที่ถูกต้อง
    if (response.data && Array.isArray(response.data)) {
      console.log("✅ [SERVICE] Valid enrolled activities data, count:", response.data.length);
      return response.data;
    } else {
      console.warn("⚠️ [SERVICE] Invalid enrolled activities response data:", response.data);
      console.warn("⚠️ [SERVICE] Response data type:", typeof response.data);
      return [];
    }
  } catch (error: any) {
    console.error("❌ [SERVICE] Error in fetchEnrolledActivities:", error);
    console.error("❌ [SERVICE] Error response:", error.response);
    console.error("❌ [SERVICE] Error status:", error.response?.status);
    console.error("❌ [SERVICE] Error data:", error.response?.data);
    throw error;
  }
};
//------------------------------------------------------------------------------

//--------------------- Fetch Ongoing Activities for a Student -------------------------
export const fetchOngoingActivities = async (
  studentId: number
): Promise<Activity[]> => {
  console.log("🌐 [SERVICE] fetchOngoingActivities called with studentId:", studentId);
  console.log("🌐 [SERVICE] Making request to:", `/student/activity/get-ongoing-activities/${studentId}`);
  
  try {
    const response = await axiosInstance.get<Activity[]>(
      `/student/activity/get-ongoing-activities/${studentId}`
    );
    
    console.log("✅ [SERVICE] Ongoing activities response received:", response.data);
    
    // ตรวจสอบว่า response.data เป็น array ที่ถูกต้อง
    if (response.data && Array.isArray(response.data)) {
      console.log("✅ [SERVICE] Valid ongoing activities data, count:", response.data.length);
      return response.data;
    } else {
      console.warn("⚠️ [SERVICE] Invalid ongoing activities response data:", response.data);
      return [];
    }
  } catch (error: any) {
    console.error("❌ [SERVICE] Error in fetchOngoingActivities:", error);
    throw error;
  }
};
//------------------------------------------------------------------------------

//--------------------- Fetch Recommended Activity IDs --------------------------
export const fetchRecommendedIds = async (
  studentId: number
): Promise<number[]> => {
  const response = await axiosInstance.get<number[]>(
    `${STUDENT_ACTIVITY_PATH}/recommended?studentId=${encodeURIComponent(studentId)}`
  );
  return response.data;
};
//-------------------------------------------------------------------------------

//--------------------- Fetch Single Activity with Enrollment State -------------
export const fetchActivity = async (id: number | string): Promise<Activity> => {
  const response = await axiosInstance.get<Activity>(
    `${STUDENT_ACTIVITY_PATH}/get-activity/${id}`
  );
  return response.data;
};
//------------------------------------------------------------------------------

//--------------------- Enrolled Activity --------------------------------------
export const enrollActivity = async (
  studentId: number,
  activityId: number,
  food?: string[]
) => {
  console.log("in service");

  console.log("studentId: ", studentId);
  console.log("activityId: ", activityId);
  console.log("food: ", food);

  return axiosInstance.post(
    `${STUDENT_ACTIVITY_PATH}/student-enroll-activity/${activityId}/${studentId}`,
    { food }
  );
};

//------------------------------------------------------------------------------

//--------------------- Unenrolled Activity ------------------------------------
export const unEnrollActivity = async (studentId: number, activityId: number) => {
  return axiosInstance.delete(
    `${STUDENT_ACTIVITY_PATH}/unenroll-activity/${studentId}?activityId=${activityId}`
  );
};
//------------------------------------------------------------------------------

export const fetchEndActivities = async (studentId: number): Promise<Activity[]> => {
  console.log("🌐 [SERVICE] fetchActivities called with studentId:", studentId);
  console.log("🌐 [SERVICE] Making request to:", `${STUDENT_ACTIVITY_PATH}/history/${studentId}`);
  
  try {
    const response = await axiosInstance.get<Activity[]>(
      `${STUDENT_ACTIVITY_PATH}/history/${studentId}`
    );
    
    console.log("✅ [SERVICE] Response received:", response.data);
    
    // ตรวจสอบว่า response.data เป็น array ที่ถูกต้อง
    if (response.data && Array.isArray(response.data)) {
      console.log("✅ [SERVICE] Valid response data, count:", response.data.length);
      return response.data;
    } else {
      console.warn("⚠️ [SERVICE] Invalid response data:", response.data);
      return [];
    }
  } catch (error) {
    console.error("❌ [SERVICE] Error in fetchActivities:", error);
    throw error;
  }
};

//--------------------- Check-in/Check-out Activity -------------------------
export const checkInOutActivity = async (
  activityId: number,
  username: string,
  password: string
): Promise<{ success: boolean; message: string; studentId?: number; studentInfo?: any }> => {
  console.log("🌐 [SERVICE] checkInOutActivity called with:", { activityId, username });
  
  try {
    const response = await axiosInstance.post(
      `${STUDENT_ACTIVITY_PATH}/check-in-out/${activityId}`,
      { username, password }
    );
    
    console.log("✅ [SERVICE] Check-in/out response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ [SERVICE] Error in checkInOutActivity:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("เกิดข้อผิดพลาดในการลงทะเบียน");
  }
};

//--------------------- Export Service -----------------------------------------
const activityService = {
  fetchActivities,
  searchActivities,
  fetchRecommendedIds,
  fetchActivity,
  enrollActivity,
  unEnrollActivity,
  fetchEnrolledActivities,
  fetchOngoingActivities,
  fetchEndActivities,
  checkInOutActivity,
};
//------------------------------------------------------------------------------

export default activityService;
