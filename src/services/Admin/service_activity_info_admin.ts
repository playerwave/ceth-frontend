import axiosInstance from "../../libs/axios";
import { ApiActivity } from "../../types/Admin/type_activity_info_admin";

export const fetchAllActivities = async (): Promise<ApiActivity[]> => {
  const { data } = await axiosInstance.get("/admin/activity/get-activities");
  return data;
};

export const fetchActivityById = async (id: number | string): Promise<ApiActivity> => {
  const numericId = Number(id);
  if (!numericId || isNaN(numericId)) throw new Error("Invalid Activity ID");

  const { data } = await axiosInstance.get(`/admin/activity/get-activity/${numericId}`);
  return data;
};
