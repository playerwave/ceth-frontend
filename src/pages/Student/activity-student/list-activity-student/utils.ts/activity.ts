import { Activity } from "../../../../../types/activity.types";

export const filterAvailablePublicActivities = (activities: unknown[]) => {
  return activities.filter(
    (a) => (a as { status?: string; seat?: number; registered_count?: number }).status === "Public" && 
           (a as { seat?: number; registered_count?: number }).seat !== (a as { registered_count?: number }).registered_count,
  );
};

export const isSameSearchTerm = (prev: string, next: string) => {
  return prev.trim() === next.trim();
};

export function isRecommended(activity: Activity): boolean {
  // ใส่เงื่อนไขจริงของคุณตรงนี้
  return (activity.recieve_hours || 0) >= 2 && activity.activity_status === "Public";
}
