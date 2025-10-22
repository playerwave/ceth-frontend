// stores/Activity/activity.service.ts
import axiosInstance from "../../libs/axios";
import { Activity } from "../../types/activity.types";

//base path
const TEACHER_ACTIVITY_PATH = "/teacher/activity";

//--------------------- Fetch Activities -------------------------
export const fetchAllActivities = async (): Promise<Activity[]> => {
  try {
    console.log("🔍 [ActivityService] Starting fetchAllActivities");
    console.log("🔍 [ActivityService] Request URL:", `${TEACHER_ACTIVITY_PATH}/get-activities`);
    
    const response = await axiosInstance.get<Activity[]>(
      `${TEACHER_ACTIVITY_PATH}/get-activities`
    );
    
    console.log("🔍 [ActivityService] Response received:", {
      status: response.status,
      statusText: response.statusText,
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      dataLength: Array.isArray(response.data) ? response.data.length : 'N/A'
    });
    
    // ✅ ตรวจสอบ response data
    if (!response.data || !Array.isArray(response.data)) {
      console.warn("⚠️ Invalid response data from API:", response.data);
      return [];
    }
    
    console.log(`✅ fetchAllActivities: Retrieved ${response.data.length} activities`);
    console.log("🔍 [ActivityService] First few activities:", response.data.slice(0, 3).map(a => ({
      id: a.activity_id,
      name: a.activity_name,
      status: a.activity_status,
      state: a.activity_state
    })));
    
    return response.data;
  } catch (error) {
    console.error("❌ fetchAllActivities error:", error);
    
    // ✅ ตรวจสอบ error type และ return appropriate response
    if (error instanceof Error) {
      console.log("🔍 [ActivityService] Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
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
  console.log("🔍 Certificate fields from API:", {
    certificate_template_url: response.data.certificate_template_url,
    upload_certificate_description: response.data.upload_certificate_description,
    certificate_ocr_data: response.data.certificate_ocr_data,
    certificate_image_analysis: response.data.certificate_image_analysis
  });
  return response.data;
};
//------------------------------------------------------------------

//--------------------- Create Activity ----------------------------
export const createActivity = async (
  payload: Partial<Activity>
): Promise<number> => {
  console.log("📤 Creating activity with payload:", payload);
  console.log("🔍 Certificate fields in frontend service:", {
    certificate_template_url: payload.certificate_template_url,
    certificate_ocr_data: payload.certificate_ocr_data,
    certificate_image_analysis: payload.certificate_image_analysis,
    upload_certificate_description: payload.upload_certificate_description
  });

  try {
    const response = await axiosInstance.post(
      `${TEACHER_ACTIVITY_PATH}/create-activity`,
      payload
    );
    console.log("📥 Create activity response:", response.data);
    return response.data.activity_id; // ✅ ส่งคืน activity_id จาก response
  } catch (error) {
    console.error("❌ Error in createActivity service:", error);
    throw error;
  }
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
    `${TEACHER_ACTIVITY_PATH}/delete-activity/${id}`,
    {
      // ✅ ไม่ส่ง body และไม่ส่ง Content-Type header
      headers: {
        // ลบ Content-Type header เพื่อไม่ให้ body-parser พยายาม parse JSON
      }
    }
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

//--------------------- Get Active Activity Years ------------------
export const getActiveActivityYears = async (): Promise<number[]> => {
  try {
    console.log("📅 Fetching active activity years...");
    const response = await axiosInstance.get<{ success: boolean; data: number[]; count: number }>(
      `${TEACHER_ACTIVITY_PATH}/active-years`
    );
    console.log(`✅ Retrieved ${response.data.count} years:`, response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("❌ getActiveActivityYears error:", error);
    throw error;
  }
};
//------------------------------------------------------------------

//--------------------- Get Activity Summary -----------------------
export interface ActivitySummaryItem {
  activityId: number;
  activityName: string;
  startDate: string;
  eventFormat: string;
  registered: number;
  attendedFull: number;
  attendedPartial: number;
}

export const getActivitySummary = async (params: {
  year: number;
  month?: number;
  quarter?: number | "all";
}): Promise<ActivitySummaryItem[]> => {
  try {
    console.log("📊 Fetching activity summary with params:", params);
    
    const queryParams = new URLSearchParams({
      year: params.year.toString()
    });
    
    if (params.month !== undefined) {
      queryParams.append('month', params.month.toString());
    }
    
    if (params.quarter !== undefined) {
      queryParams.append('quarter', params.quarter.toString());
    }
    
    const response = await axiosInstance.get<{ success: boolean; data: ActivitySummaryItem[]; count: number }>(
      `${TEACHER_ACTIVITY_PATH}/summary?${queryParams.toString()}`
    );
    
    console.log(`✅ Retrieved ${response.data.count} activities for summary`);
    return response.data.data;
  } catch (error) {
    console.error("❌ getActivitySummary error:", error);
    throw error;
  }
};
//------------------------------------------------------------------


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
  getActiveActivityYears, // ✅ ดึงปีที่มีกิจกรรม
  getActivitySummary, // ✅ ดึงสรุปกิจกรรม
};
//------------------------------------------------------------------

export default activityService;
