import { Activity } from "../../../../../types/model";

export const filterAvailablePublicActivities = (activities: any[]) => {
  return activities.filter(
    (a) => a.status === "Public" && a.seat !== a.registered_count,
  );
};

export const isSameSearchTerm = (prev: string, next: string) => {
  return prev.trim() === next.trim();
};

export function isRecommended(activity: Activity): boolean {
  // ใส่เงื่อนไขจริงของคุณตรงนี้
  return activity.recieve_hours >= 2 && activity.activity_status === "Public";
}
