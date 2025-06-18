// stores/Activity/activity.service.ts
import axiosInstance from "../../libs/axios";
import { Activity } from "../../types/model";

//--------------------- Fetch Activities -------------------------
export const fetchAllActivities = async (): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>("/admin/activity/all");
  return response.data;
};
//----------------------------------------------------------------

//--------------------- Get Activity By Id -------------------------
export const getActivityById = async (id: number): Promise<Activity> => {
  const response = await axiosInstance.get<Activity>(`/admin/activity/${id}`);
  return response.data;
};

//--------------------- Create Activity ----------------------------
export const createActivity = async (payload: Partial<Activity>) => {
  const response = await axiosInstance.post("/admin/activity", payload);
  return response.data;
};
//------------------------------------------------------------------

//--------------------- Search Activities --------------------------
export const searchActivities = async (
  searchName: string
): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>(
    `/admin/activity/search?name=${encodeURIComponent(searchName)}`
  );
  return response.data;
};
//------------------------------------------------------------------

//--------------------- Fetch Enrolled Students --------------------
export const fetchEnrolledStudents = async (
  activityId: number
): Promise<any[]> => {
  const response = await axiosInstance.get<any[]>(
    `/admin/activity/${activityId}/students`
  );
  return response.data;
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
};
//------------------------------------------------------------------

export default activityService;
