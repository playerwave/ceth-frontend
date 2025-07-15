import axiosInstance from "../../libs/axios";
import { Activity } from "../../types/model";

// Base path สำหรับ visitor/public
const VISITOR_ACTIVITY_PATH = "/visitor/activity";

//--------------------- Fetch Public Activities -------------------------
const fetchPublicActivities = async (): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>(
    `${VISITOR_ACTIVITY_PATH}/public`
  );
  return response.data;
};
//-----------------------------------------------------------------------

//--------------------- Export Service Object ---------------------------
export const activityService = {
  fetchPublicActivities,
};
//-----------------------------------------------------------------------
