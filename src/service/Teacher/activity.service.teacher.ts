// stores/Activity/activity.service.ts
import axiosInstance from "../../libs/axios";
import { Activity } from "../../types/model";

//base path
const TEACHER_ACTIVITY_PATH = "/teacher/activity";

//--------------------- Fetch Activities -------------------------
export const fetchAllActivities = async (): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>(
    `${TEACHER_ACTIVITY_PATH}/get-activities`,
  );
  return response.data;
};
//----------------------------------------------------------------

//--------------------- Get Activity By Id -------------------------
export const getActivityById = async (id: number): Promise<Activity> => {
  const response = await axiosInstance.get<Activity>(
    `${TEACHER_ACTIVITY_PATH}/${id}`,
  );
  return response.data;
};
//------------------------------------------------------------------

//--------------------- Create Activity ----------------------------
export const createActivity = async (payload: Partial<Activity>) => {
  const response = await axiosInstance.post(
    `${TEACHER_ACTIVITY_PATH}/create-activity`,
    payload,
  );
  return response.data;
};
//------------------------------------------------------------------

//--------------------- Search Activities --------------------------
export const searchActivities = async (
  searchName: string,
): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>(
    `${TEACHER_ACTIVITY_PATH}/search?name=${encodeURIComponent(searchName)}`,
  );
  return response.data;
};
//------------------------------------------------------------------

//--------------------- Fetch Enrolled Students --------------------
export const fetchEnrolledStudents = async (
  activityId: number,
): Promise<any[]> => {
  const response = await axiosInstance.get<any[]>(
    `${TEACHER_ACTIVITY_PATH}/${activityId}/students`,
  );
  return response.data;
};
//------------------------------------------------------------------

//--------------------- Update Activity Status ---------------------
export const updateActivityStatus = async (
  id: string,
  status: "Public" | "Private",
): Promise<void> => {
  await axiosInstance.put(`${TEACHER_ACTIVITY_PATH}/update-activity/${id}`, {
    status,
    last_update: new Date(),
  });
};
//------------------------------------------------------------------

//--------------------- Update Activity ----------------------------
export const updateActivity = async (activity: Activity): Promise<void> => {
  await axiosInstance.put(
    `${TEACHER_ACTIVITY_PATH}/update-activity/${activity.activity_id}`,
    {
      ...activity,
      last_update: new Date(),
    },
  );
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
  updateActivityStatus,
  updateActivity,
};
//------------------------------------------------------------------

export default activityService;
