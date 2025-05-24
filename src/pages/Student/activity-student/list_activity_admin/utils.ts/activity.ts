// ✅ utils/activity.ts
export const filterAvailablePublicActivities = (activities: any[]) => {
  return activities.filter(
    (a) => a.status === "Public" && a.seat !== a.registered_count
  );
};

export const isSameSearchTerm = (prev: string, next: string) => {
  return prev.trim() === next.trim();
};
