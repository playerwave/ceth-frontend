import axiosInstance from "../../libs/axios";
import { Activity } from "../../types/model";

// base path
const STUDENT_ACTIVITY_PATH = "/student/activity";

//--------------------- Fetch Activities for a Student -------------------------
export const fetchActivities = async (userId: number): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>(
    `${STUDENT_ACTIVITY_PATH}/get-student-activities/${userId}`
  );
  return response.data;
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

//--------------------- Fetch Recommended Activity IDs --------------------------
export const fetchRecommendedIds = async (
  userId: number
): Promise<number[]> => {
  const response = await axiosInstance.get<number[]>(
    `${STUDENT_ACTIVITY_PATH}/recommended?userId=${encodeURIComponent(userId)}`
  );
  return response.data;
};
//-------------------------------------------------------------------------------

//--------------------- Fetch Single Activity with Enrollment State -------------
// export const fetchActivity = async (
//   id: number | string,
//   userId: number
// ): Promise<Activity> => {
//   const response = await axiosInstance.get<Activity>(
//     `${STUDENT_ACTIVITY_PATH}/get-activity/${id}?userId=${encodeURIComponent(String(userId))}`
//   );
//   return response.data;
// };

// export const fetchActivity = async (
//   id: number | string,
//   userId: number | string,
// ): Promise<Activity> => {
//   const response = await axiosInstance.get<Activity>(
//     `/student/activity/get-activity/${id}`,
//     {
//       params: { userId }, 
//     }
//   );
//   return response.data;
// };

export const fetchActivity = async (
  id: number | string,
): Promise<Activity> => {
  const response = await axiosInstance.get<Activity>(
    `${STUDENT_ACTIVITY_PATH}/get-activity/${id}`,
  );
  return response.data;
};
//------------------------------------------------------------------------------

//--------------------- Enrolled Activity --------------------------------------
// export const enrollActivity = async (
//   userId: number,
//   activityId: number,
//   food: string[]
// ) => {
//   return axiosInstance.post(
//     `${STUDENT_ACTIVITY_PATH}/student-enroll-activity/${userId}`,
//     { activityId, food }
//   );
// };

export const enrollActivity = async (
  userId: number,
  activityId: number,
  food?: string[]
): Promise<void> => {
  await axiosInstance.post(
    `${STUDENT_ACTIVITY_PATH}/student-enroll-activity/${userId}`,
    { activityId, food }
  );
};

//------------------------------------------------------------------------------

//--------------------- Unenrolled Activity ------------------------------------
export const unEnrollActivity = async (userId: number, activityId: number) => {
  return axiosInstance.delete(
    `${STUDENT_ACTIVITY_PATH}/unenroll-activity/${userId}`,
    { data: { activityId } }
  );
};
//------------------------------------------------------------------------------

//--------------------- Get Enrolled Activities ---------------------------------
export const fetchEnrolledActivities = async (
  studentId: number | string,
): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>(
    `${STUDENT_ACTIVITY_PATH}/get-enrolled-activities/${studentId}`,
  );
  return response.data;
};
//-------------------------------------------------------------------------------
//--------------------- Export Service -----------------------------------------
const activityService = {
  fetchActivities,
  searchActivities,
  fetchRecommendedIds,
  fetchActivity,
  enrollActivity,
  unEnrollActivity,
};
//------------------------------------------------------------------------------

export default activityService;
