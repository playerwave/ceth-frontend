// stores/Activity/activity.service.ts
import axiosInstance from "../../libs/axios";
import { Activity } from "../../types/model";

//base path
const TEACHER_ACTIVITY_PATH = "/teacher/activity";

//--------------------- Fetch Activities -------------------------
export const fetchAllActivities = async (): Promise<Activity[]> => {
  try {
    const response = await axiosInstance.get<Activity[]>(
      `${TEACHER_ACTIVITY_PATH}/get-activities`
    );
    
    // ✅ ตรวจสอบ response data
    if (!response.data || !Array.isArray(response.data)) {
      console.warn("⚠️ Invalid response data from API:", response.data);
      return [];
    }
    
    console.log(`✅ fetchAllActivities: Retrieved ${response.data.length} activities`);
    return response.data;
  } catch (error) {
    console.error("❌ fetchAllActivities error:", error);
    
    // ✅ ตรวจสอบ error type และ return appropriate response
    if (error instanceof Error) {
      if (error.message.includes('Network Error') || error.message.includes('timeout')) {
        console.warn("⚠️ Network error, returning empty array");
        return [];
      }
    }
    
    // ✅ Re-throw error เพื่อให้ store จัดการ
    throw error;
  }
};
//----------------------------------------------------------------

//--------------------- Get Activity By Id -------------------------
export const getActivityById = async (id: number): Promise<Activity> => {
  const response = await axiosInstance.get<Activity>(
    `${TEACHER_ACTIVITY_PATH}/get-activity/${id}`
  );
  console.log("🔍 Activity data service:", response.data);
  return response.data;
};
//------------------------------------------------------------------

//--------------------- Create Activity ----------------------------
export const createActivity = async (
  payload: Partial<Activity>
): Promise<number> => {
  console.log("📤 Creating activity with payload:", payload);

  const response = await axiosInstance.post(
    `${TEACHER_ACTIVITY_PATH}/create-activity`,
    payload
  );
  console.log("📥 Create activity response:", response.data);
  return response.data.activity_id; // ✅ ส่งคืน activity_id จาก response
};
//------------------------------------------------------------------

//--------------------- Search Activities --------------------------
export const searchActivities = async (
  searchName: string
): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>(
    `${TEACHER_ACTIVITY_PATH}/search?name=${encodeURIComponent(searchName)}`
  );
  return response.data;
};
//------------------------------------------------------------------

//--------------------- Fetch Enrolled Students --------------------
export const fetchEnrolledStudents = async (
  activityId: number
): Promise<unknown[]> => {
  const response = await axiosInstance.get<unknown[]>(
    `${TEACHER_ACTIVITY_PATH}/${activityId}/students`
  );
  return response.data;
};
//------------------------------------------------------------------

//--------------------- Get Enrolled Students for Activity -------------------------
export const getEnrolledStudentsForActivity = async (activityId: number) => {
  console.log("🌐 [SERVICE] getEnrolledStudentsForActivity called with activityId:", activityId);
  
  try {
    const response = await axiosInstance.get(
      `/teacher/activity/get-enrolled-students/${activityId}`
    );
    
    console.log("✅ [SERVICE] Enrolled students response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ [SERVICE] Error in getEnrolledStudentsForActivity:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("ไม่สามารถดึงข้อมูลนักเรียนที่ลงทะเบียนได้");
  }
};

//--------------------- Update Activity Status ---------------------
export const updateActivityStatus = async (
  id: string,
  status: "Public" | "Private"
): Promise<void> => {
  await axiosInstance.patch(
    `${TEACHER_ACTIVITY_PATH}/update-activity-status/${id}`,
    {
      activity_status: status,
      last_update: new Date(),
    }
  );
};
//------------------------------------------------------------------

//--------------------- Update Activity ----------------------------
export const updateActivity = async (activity: Activity): Promise<number> => {
  console.log("update activity: ", activity);
  const response = await axiosInstance.put(
    `${TEACHER_ACTIVITY_PATH}/update-activity/${activity.activity_id}`,
    {
      ...activity,
      last_update: new Date(),
    }
  );
  console.log("📥 Update activity response:", response.data);
  return activity.activity_id; // ✅ ส่งคืน activity_id จาก input
};
//--------------------------------------------------------------------

//--------------------- addFoodToActivity ----------------------------
export const addFoodToActivity = async (
  activity_id: number,
  food_id: number
) => {
  console.log("🍽️ Adding food to activity:", { activity_id, food_id });
  const response = await axiosInstance.post(
    `/teacher/activity/${activity_id}/add-food`,
    {
      food_id,
    }
  );
  console.log("✅ Add food response:", response.data);
  return response;
};
//------------------------------------------------------------------

//--------------------- removeFoodFromActivity ----------------------------

export const removeFoodFromActivity = async (activity_food_id: number) => {
  console.log("🗑️ Removing food from activity:", { activity_food_id });
  const response = await axiosInstance.delete(
    `/teacher/activity/remove-food/${activity_food_id}`
  );
  console.log("✅ Remove food response:", response.data);
  return response;
};
//------------------------------------------------------------------

//--------------------- Delete Activity ----------------------------
export const deleteActivity = async (id: number): Promise<void> => {
  console.log("🗑️ Deleting activity with ID:", id);
  const response = await axiosInstance.delete(
    `${TEACHER_ACTIVITY_PATH}/delete-activity/${id}`
  );
  console.log("✅ Delete activity response:", response.data);
};
//------------------------------------------------------------------

//--------------------- Fetch Activities -------------------------
export const fetchEndActivities = async (): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>(
    `${TEACHER_ACTIVITY_PATH}/get-activities-history`
  );
  return response.data;
};
//----------------------------------------------------------------


//--------------------- Export Service -----------------------------
// เป็นนการทำ Object literal เพื่อรวมฟังก์ชันทั้งหมดที่เกี่ยวข้องกกับ activity
const activityService = {
  fetchAllActivities,
  getActivityById,
  createActivity,
  searchActivities,
  fetchEnrolledStudents,
  getEnrolledStudentsForActivity,
  updateActivityStatus,
  updateActivity,
  addFoodToActivity,
  removeFoodFromActivity,
  deleteActivity, // ✅ เพิ่มฟังก์ชันลบกิจกรรม
  fetchEndActivities,
};
//------------------------------------------------------------------

export default activityService;
