// stores/Student/Main/main_activity_student.service.ts

import axiosInstance from "../../libs/axios";
import { MainActivity } from "../../types/Student/type_main_activity_student";

export const fetchEnrolledActivitiesAPI = async (userId: string): Promise<MainActivity[]> => {
  const response = await axiosInstance.get(`/student/activity/get-enrolled-activities/${userId}`);
  return response.data;
};
