import axiosInstance from "../../libs/axios";
import { Activity } from "../../types/model";

// base path
const STUDENT_ACTIVITY_PATH = "/student/activity";

//--------------------- Fetch Activities for a Student -------------------------
export const fetchActivities = async (studentId: number): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>(
    `${STUDENT_ACTIVITY_PATH}/get-student-activities/${studentId}`
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

//--------------------- Fetch Enrolled Activities for a Student -------------------------
export const fetchEnrolledActivities = async (
  studentId: number
): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>(
    `/student/activity/get-enrolled-activities/${studentId}`
  );
  return response.data;
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

//--------------------- Export Service -----------------------------------------
const activityService = {
  fetchActivities,
  searchActivities,
  fetchRecommendedIds,
  fetchActivity,
  enrollActivity,
  unEnrollActivity,
  fetchEnrolledActivities,
};
//------------------------------------------------------------------------------

export default activityService;
