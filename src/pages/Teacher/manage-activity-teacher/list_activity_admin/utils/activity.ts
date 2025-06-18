// utils/activity.ts

import { Activity } from "../../../../../types/Admin/activity_list_type";

// เปรียบเทียบคำค้นหา (ป้องกันค้นหาซ้ำคำเดิม)
export const isSameSearchTerm = (
  newTerm: string,
  currentTerm: string
): boolean => {
  return newTerm.trim().toLowerCase() === currentTerm.trim().toLowerCase();
};

// กรองกิจกรรมตามสถานะ (Public หรือ Private)
export const filterActivitiesByStatus = (
  activities: Activity[],
  status: "Public" | "Private"
): Activity[] => {
  return activities.filter((a) => a.status === status);
};
