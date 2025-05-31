// services/activity.service.ts
import axiosInstance from "../../libs/axios";
import { ApiActivity } from "../../types/Admin/type_create_activity_admin";

export const fetchActivityByIdService = async (id: number) => {
  const response = await axiosInstance.get(`/admin/activity/get-activity/${id}`);
  return response.data;
};

export const updateActivityService = async (activity: ApiActivity) => {
  await axiosInstance.put(
    `/admin/activity/update-activity/${activity.ac_id}`,
    activity
  );
};

export const deleteActivityService = async (id: number) => {
  await axiosInstance.delete(`/admin/activity/delete-activity/${id}`, {
    data: { activityId: id },
  });
};
