import { create } from "zustand";
import axiosInstance from "../../libs/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ApiActivity {
  ac_id: number;
  ac_name: string;
  ac_company_lecturer: string;
  ac_description: string;
  ac_type: string;
  ac_room: string;
  ac_seat: number;
  ac_food?: string[];
  ac_status: string;
  ac_location_type: string;
  ac_start_register?: Date;
  ac_end_register?: Date;
  ac_create_date?: Date;
  ac_last_update?: Date;
  ac_registered_count: number;
  ac_attended_count?: number;
  ac_not_attended_count?: number;
  ac_start_time?: Date;
  ac_end_time?: Date;
  ac_image_url?: string;
  ac_state: string;
  ac_normal_register: string;
  ac_recieve_hours?: number;
  ac_start_assessment?: Date;
  ac_end_assessment?: Date;
  assessment?: {
    as_id: number;
    as_name: string;
    as_type: string;
    as_description: string;
    as_create_date: string;
    as_last_update?: string;
  } | null;
}

interface Activity {
  id: string;
  name: string;
  company_lecturer: string;
  description: string;
  type: "Hard Skill" | "Soft Skill";
  room: string;
  seat: string;
  food: string[];
  status: string;
  location_type: "Onsite" | "Online" | "Course";
  start_register: Date | null;
  end_register: Date | null;
  create_date: Date | null;
  last_update: Date | null;
  registered_count: number;
  attended_count: number;
  not_attended_count: number;
  start_time: Date | null;
  end_time: Date | null;
  image_url: string;
  state: string;
  normal_register: Date | null;
  recieve_hours: number;
  start_assessment: Date | null;
  end_assessment: Date | null;
  assessment_id: number | null;
  assessment?: {
    as_id: number;
    as_name: string;
    as_type: string;
    as_description: string;
    as_create_date: string;
    as_last_update?: string;
  } | null;
}

interface EnrolledStudent {
  id: string;
  name: string;
  department: string;
  status: string;
  checkIn: string;
  checkOut: string;
  evaluated: string;
}

interface ActivityState {
  activities: Activity[];
  searchResults: Activity[] | null;
  activityError: string | null;
  activityLoading: boolean;
  activity: Activity | null;
  enrolledStudents: EnrolledStudent[];
  fetchActivities: () => Promise<void>;
  searchActivities: (query: string) => Promise<void>;
  updateActivityStatus: (
    id: string,
    currentStatus: "Public" | "Private"
  ) => Promise<void>;
  fetchActivity: (id: number | string) => Promise<Activity | null>;
  fetchEnrolledStudents: (id: number | string) => Promise<void>;
  createActivity: (activity: ApiActivity) => Promise<void>;
}

function forceToArray(input: unknown): string[] {
  if (typeof input !== "string") return [];
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    const cleaned = input.replace(/[{}\"]+/g, "").trim();
    if (cleaned) return [cleaned];
  }
  return [];
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  searchResults: null,
  activityError: null,
  activityLoading: false,
  activity: null,
  enrolledStudents: [],

  fetchActivities: async () => {
    set({ activityLoading: true, activityError: null });
    try {
      const response = await axiosInstance.get("/admin/activity/get-activities");
      const formattedActivities = response.data.map((a: ApiActivity) => mapActivityData(a));
      set({ activities: formattedActivities, activityLoading: false });
    } catch (error) {
      console.error("Error fetching activities:", error);
      set({ activityError: "ไม่สามารถโหลดกิจกรรมได้", activityLoading: false });
    }
  },

  searchActivities: async (searchName: string) => {
    if (!searchName.trim()) {
      get().fetchActivities();
      set({ searchResults: null });
      return;
    }
    set({ activityLoading: true, activityError: null });
    try {
      const { data } = await axiosInstance.get(`/admin/activity/searchActivity`, {
        params: { ac_name: searchName.trim() || "" },
      });
      const mappedResults = Array.isArray(data) ? data.map(mapActivityData) : [];
      set({ searchResults: mappedResults, activityLoading: false });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message ?? "Error searching activities";
      set({ activityError: errorMessage, activityLoading: false });
    }
  },

  updateActivityStatus: async (id, currentStatus) => {
    set({ activityLoading: true });
    try {
      const newStatus = currentStatus === "Public" ? "Private" : "Public";
      await axiosInstance.patch(`/admin/activity/adjustActivity/${id}`, {
        ac_status: newStatus.toLowerCase(),
      });
      await get().fetchActivities();
    } catch {
      set({ activityLoading: false });
    }
  },

  fetchActivity: async (id) => {
    const numericId = Number(id);
    if (!numericId || isNaN(numericId)) {
      set({ activityError: "Invalid Activity ID", activityLoading: false });
      return null;
    }
    set({ activityLoading: true, activityError: null });
    try {
      const { data } = await axiosInstance.get<ApiActivity>(
        `/admin/activity/get-activity/${numericId}`
      );
      data.ac_food = forceToArray(data.ac_food || []);
      const mappedActivity = mapActivityData(data);
      set({ activity: mappedActivity, activityLoading: false });
      return mappedActivity;
    } catch (error: any) {
      set({ activityError: error.response?.data?.message || "Error fetching activity", activityLoading: false });
      return null;
    }
  },

  fetchEnrolledStudents: async (activityId: number) => {
    try {
      const res = await axiosInstance.get(`/admin/activity/get-enrolled-studentslist/${activityId}`);
      const mappedStudents = res.data.students.map((s: any) => ({
        id: s.studentid,
        name: s.fullname,
        department: s.department || "SE",
        status: s.riskstatus === "Low" ? "normal" : "risk",
        checkIn: "No",
        checkOut: "No",
        evaluated: "No",
      }));
      set({ enrolledStudents: mappedStudents });
    } catch {
      set({ enrolledStudents: [] });
    }
  },

  createActivity: async (activity: ApiActivity): Promise<void> => {
    set({ activityLoading: true, activityError: null });
    try {
      await axiosInstance.post("/admin/activity/create-activity", activity);
      set((state) => ({
        activities: [...state.activities, mapActivityData(activity)],
        activityLoading: false,
        enrolledStudents: [],
      }));
    } catch (error: any) {
      set({ activityError: error.message, activityLoading: false });
    }
  },
}));

function mapActivityData(apiData: ApiActivity): Activity {
  return {
    id: apiData.ac_id.toString(),
    name: apiData.ac_name || "ไม่ระบุชื่อ",
    company_lecturer: apiData.ac_company_lecturer || "ไม่ระบุวิทยากร",
    description: apiData.ac_description || "ไม่ระบุรายละเอียด",
    type: apiData.ac_type === "Hard Skill" ? "Hard Skill" : "Soft Skill",
    room: apiData.ac_room || "ไม่ระบุห้อง",
    seat: `${apiData.ac_seat}`,
    food: Array.isArray(apiData.ac_food) ? apiData.ac_food : [],
    status: apiData.ac_status.toLowerCase() === "public" ? "Public" : "Private",
    location_type: apiData.ac_location_type as Activity["location_type"],
    start_register: apiData.ac_start_register ? new Date(apiData.ac_start_register) : null,
    end_register: apiData.ac_end_register ? new Date(apiData.ac_end_register) : null,
    create_date: apiData.ac_create_date ? new Date(apiData.ac_create_date) : null,
    last_update: apiData.ac_last_update ? new Date(apiData.ac_last_update) : null,
    start_time: apiData.ac_start_time ? new Date(apiData.ac_start_time) : null,
    end_time: apiData.ac_end_time ? new Date(apiData.ac_end_time) : null,
    registered_count: apiData.ac_registered_count ?? 0,
    attended_count: apiData.ac_attended_count ?? 0,
    not_attended_count: apiData.ac_not_attended_count ?? 0,
    image_url: apiData.ac_image_url || "/img/default.png",
    state: apiData.ac_state || "ไม่ระบุ",
    normal_register: apiData.ac_normal_register ? new Date(apiData.ac_normal_register) : null,
    recieve_hours: apiData.ac_recieve_hours || 0,
    start_assessment: apiData.ac_start_assessment ? new Date(apiData.ac_start_assessment) : null,
    end_assessment: apiData.ac_end_assessment ? new Date(apiData.ac_end_assessment) : null,
    assessment_id: apiData.assessment?.as_id ?? null,
    assessment: apiData.assessment || null,
  };
}