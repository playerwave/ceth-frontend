import axiosInstance from "../../libs/axios";
import type { EnrolledStudent } from "../../types/Admin/type_enrolled_list_admin";

export const fetchEnrolledStudentsByActivityId = async (
  activityId: number
): Promise<EnrolledStudent[]> => {
  const res = await axiosInstance.get(`/admin/activity/get-enrolled-studentslist/${activityId}`);

  // Return raw data — mapping ให้ store จัดการเอง หรือแปลงก่อน return ก็ได้ตามออกแบบ
  return res.data.students;
};
