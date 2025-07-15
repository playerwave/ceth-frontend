import axiosInstance from "../../libs/axios";
import { Activity } from "../../types/model";

//--------------------- Fetch Activities for a Student -------------------------
export const fetchActivities = async (userId: number): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>(
    `/student/activity?userId=${encodeURIComponent(userId)}`,
  );
  return response.data;
};
//------------------------------------------------------------------------------

//--------------------- Search Activities --------------------------------------
export const searchActivities = async (
  searchName: string,
): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>(
    `/student/activity/search?name=${encodeURIComponent(searchName)}`,
  );
  return response.data;
};
//-------------------------------------------------------------------------------

//--------------------- Fetch Recommended Activity IDs --------------------------
export const fetchRecommendedIds = async (
  userId: number,
): Promise<number[]> => {
  const response = await axiosInstance.get<number[]>(
    `/student/activity/recommended?userId=${encodeURIComponent(userId)}`,
  );
  return response.data;
};
//-------------------------------------------------------------------------------

//--------------------- Fetch Single Activity with Enrollment State -------------
export const fetchActivity = async (
  id: number | string,
  userId: number,
): Promise<Activity> => {
  const response = await axiosInstance.get<Activity>(
    `/student/activity/${id}?userId=${encodeURIComponent(String(userId))}`,
  );
  return response.data;
};
////------------------------------------------------------------------------------

//--------------------- Export Service -------------------------------------------
// รวมฟังก์ชันทั้งหมดที่เกี่ยวข้องกับ student‐activity
const activityService = {
  fetchActivities,
  searchActivities,
  fetchActivity,
};
//--------------------------------------------------------------------------------

export default activityService;
