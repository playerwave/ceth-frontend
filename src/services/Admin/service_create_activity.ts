import axiosInstance from "../../libs/axios";
import { ApiActivity } from "../../types/Admin/type_create_activity_admin";


export const createActivityService = async (
  activity: ApiActivity
): Promise<void> => {
  await axiosInstance.post("/admin/activity/create-activity", activity);
};