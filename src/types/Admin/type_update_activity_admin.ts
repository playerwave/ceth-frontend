// types/Admin/type_update_activity_admin.ts
import { ApiActivity } from "./type_create_activity_admin";

export interface UpdateActivityStoreState {
  activity: ApiActivity | null;
  activityError: string | null;
  activityLoading: boolean;
  fetchActivity: (id: number) => Promise<ApiActivity | null>;
  updateActivity: (activity: ApiActivity) => Promise<void>;
  deleteActivity: (id: number) => Promise<void>;
}
