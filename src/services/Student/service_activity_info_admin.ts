import axiosInstance from "../../libs/axios";
import type { ApiActivity, EnrolledStudent, Activity } from "../../types/Student/type_activity_info_admin";

export const fetchActivities = async (): Promise<ApiActivity[]> => {
  const { data } = await axiosInstance.get("/student/activity/get-student-activities");
  return data;
};

export const fetchStudentActivities = async (userId: string): Promise<ApiActivity[]> => {
  const { data } = await axiosInstance.get(`/student/activity/get-student-activities/${userId}`);
  return data;
};

export const fetchActivity = async (id: number | string, userId: number): Promise<ApiActivity> => {
  const { data } = await axiosInstance.get<ApiActivity>(`/student/activity/get-activity/${id}?userId=${userId}`);
  return data;
};

export const fetchEnrolledActivities = async (studentId: string): Promise<Activity[]> => {
  const { data } = await axiosInstance.get<Activity[]>(`/student/activity/get-enrolled-activities/${studentId}`);
  return data;
};

export const fetchEnrolledStudents = async (activityId: number | string): Promise<EnrolledStudent[]> => {
  const { data } = await axiosInstance.get(`/admin/activity/get-enrolled-studentslist/${activityId}`);
  return data.students;
};

export const enrollActivity = async (
  userId: string,
  activityId: number,
  food?: string
): Promise<void> => {
  await axiosInstance.post(`/student/activity/student-enroll-activity/${userId}`, { activityId, food });
};

export const unenrollActivity = async (
  userId: number,
  activityId: number
): Promise<void> => {
  await axiosInstance.delete(`/student/activity/unenroll-activity/${userId}`, {
    data: { activityId },
  });
};
