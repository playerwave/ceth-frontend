import { create } from "zustand";
import axiosInstance from "../../libs/axios";
import { AxiosError } from "axios";

// ✅ อินเทอร์เฟซสำหรับข้อมูลที่มาจาก API
interface ApiActivity {
  ac_id: number;
  ac_name: string;
  ac_company_lecturer: string;
  ac_description: string;
  ac_type: string;
  ac_room: string;
  ac_seat: number;
  ac_food: string[];
  ac_status: string;
  ac_start_register: Date;
  ac_end_register: Date;
  ac_create_date: Date;
  ac_last_update: Date;
  ac_registered_count: number;
  ac_attended_count: number;
  ac_not_attended_count: number;
  ac_start_time: Date;
  ac_end_time: Date;
  ac_image_url: string;
  ac_state: string;
}

// ✅ อินเทอร์เฟซที่ React ใช้งาน
interface Activity {
  id: string;
  name: string;
  description: string;
  type: "Hard Skill" | "Soft Skill";
  start_time: Date;
  seat: string;
  status: "Public" | "Private";
  registerant_count: number;
}

// ✅ อินเทอร์เฟซสำหรับข้อมูลนิสิตที่ลงทะเบียน
interface EnrolledStudent {
  id: string;
  name: string;
  department: string;
  status: string;
  checkIn: string;
  checkOut: string;
  evaluated: string;
<<<<<<< HEAD
  selectedfood: string;
=======
>>>>>>> b18dec3 (add recomend activity (no store))
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
  fetchActivity: (id: number) => Promise<void>;
  fetchEnrolledStudents: (id: number) => Promise<void>;
}

// ✅ ฟังก์ชันแปลงข้อมูลจาก API เป็นรูปแบบที่ React ใช้งานได้
const mapActivityData = (apiData: ApiActivity): Activity => ({
  id: apiData.ac_id.toString(),
  name: apiData.ac_name || "ไม่ระบุชื่อ",
  description: apiData.ac_description || "ไม่ระบุรายละเอียด",
  type: apiData.ac_type === "Hard Skill" ? "Hard Skill" : "Soft Skill",
  start_time: new Date(apiData.ac_start_time),
  registerant_count: apiData.ac_registered_count ?? 0,
  seat: `${apiData.ac_seat}/${apiData.ac_registered_count ?? 0}`,
  status: apiData.ac_status.toLowerCase() === "public" ? "Public" : "Private",
  ac_food: apiData.ac_food ?? [], // ✅ แก้ให้ `ac_food` มีค่าเริ่มต้นเป็น `[]`
});

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
      const { data } = await axiosInstance.get<ApiActivity[]>(
        "/activity/get-activities"
      ); // ✅ เปลี่ยน URL ให้ตรงกับ Backend
      if (Array.isArray(data) && data.length > 0) {
        set({ activities: data.map(mapActivityData), activityLoading: false });
      } else {
        set({ activities: [], activityLoading: false });
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({
        activityError:
          err.response?.data?.message ?? "Error fetching activities",
        activityLoading: false,
      });
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
      const { data } = await axiosInstance.get(`/activity/searchActivity`, {
        params: { ac_name: searchName },
      });
      set({
        searchResults: Array.isArray(data) ? data.map(mapActivityData) : [],
        activityLoading: false,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({
        activityError:
          err.response?.data?.message ?? "Error searching activities",
        activityLoading: false,
      });
    }
  },

  updateActivityStatus: async (id, currentStatus) => {
    set({ activityLoading: true });
    try {
      const newStatus = currentStatus === "Public" ? "Private" : "Public";
      await axiosInstance.patch(`/activity/adjustActivity/${id}`, {
        ac_status: newStatus.toLowerCase(),
      });
      await get().fetchActivities();
    } catch (error) {
      set({ activityLoading: false });
    }
  },

  fetchActivity: async (id) => {
    if (!id || isNaN(id)) {
      set({
        activityError: "Invalid Activity ID",
        activityLoading: false,
        activity: null,
      });
      return;
    }

    set({ activityLoading: true, activityError: null, activity: null });

    try {
      const { data } = await axiosInstance.get<ApiActivity>(
        `/activity/get-activity/${id}`
      );

      console.log("📡 API Response:", data);

      if (!data || Object.keys(data).length === 0) {
        set({ activityError: "Activity not found", activityLoading: false });
        return null;
      }

      console.log(data.ac_food);

<<<<<<< HEAD
      // data.ac_food = forceToArray(data.ac_food || []);
=======
      data.ac_food = forceToArray(data.ac_food || []);
>>>>>>> b18dec3 (add recomend activity (no store))

      // ✅ ตรวจสอบว่า mapActivityData() คืนค่า `Activity` ที่ถูกต้อง
      const mappedActivity = mapActivityData(data);
      console.log("✅ Mapped Activity:", mappedActivity);

      set({ activity: mappedActivity, activityLoading: false });

      return mappedActivity; // ✅ คืนค่า Activity
    } catch (error: any) {
      set({
        activityError:
          error.response?.data?.message || "Error fetching activity",
        activityLoading: false,
        activity: null,
      });
    }
  },

  deleteActivity: async (activityId: number | string) => {
    try {
<<<<<<< HEAD
      set({ activityLoading: true, activityError: null });
=======
>>>>>>> b18dec3 (add recomend activity (no store))
      console.log(`🛑 deleteActivity: , activityId=${activityId}`);

      const response = await axiosInstance.delete(
        `/admin/activity/delete-activity/${activityId}`,
        {
          data: { activityId },
        }
      );

      if (response.status === 200) {
<<<<<<< HEAD
        toast.success("ลบกิจกรรมสำเร็จ !", { duration: 3000 });
      } else {
        toast.error("ลบกิจกรรมไม่สำเร็จ T-T", { duration: 3000 });
        throw new Error("❌ ไม่สามารถลบกิจกรรมได้");
      }
      set({ activityLoading: false });
=======
        toast.success("✅ ลบกิจกรรมสำเร็จ");
      } else {
        throw new Error("❌ ไม่สามารถลบกิจกรรมได้");
      }
>>>>>>> b18dec3 (add recomend activity (no store))
    } catch (error: any) {
      console.error("❌ Error in deleteActivity:", error);

      if (error.response) {
        toast.error(
          `❌ ล้มเหลว: ${error.response.data.message || "เกิดข้อผิดพลาด"}`
        );
      } else {
        toast.error("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
      }
    }
  },

  // fetchEnrolledStudents: async (activityId: number) => {
  //   const res = await axiosInstance.get(
  //     `/admin/activity/get-enrolled-studentslist/${activityId}`
  //   );
  //   const studentsRaw = res.data.students;

  //   const mappedStudents = studentsRaw.map((s: any) => ({
  //     id: s.studentid,
  //     name: s.fullname,
  //     department: s.department || "ไม่ระบุ",
  //     status: s.riskstatus === "Low" ? "normal" : "risk",
  //     checkIn: s.checkIn || "No",
  //     checkOut: s.checkOut || "No",
  //     evaluated: s.evaluated || "No",
  //   }));

  //   set({ enrolledStudents: mappedStudents });
  // },

  fetchEnrolledStudents: async (activityId: number) => {
    try {
      const res = await axiosInstance.get(
        `/admin/activity/get-enrolled-studentslist/${activityId}`
      );
      console.log("📥 Raw students from API:", res.data);
      console.log(activityId);

      console.log(typeof activityId);

      const mappedStudents = res.data.students.map((s: any) => ({
        id: s.studentid, // ใช้ studentid → id
        name: s.fullname, // fullname → name
        department: s.department || "SE", // ถ้าไม่มีให้ default ไว้ (เช่น "SE")
        status: s.riskstatus === "Low" ? "normal" : "risk",
        checkIn: "No", // ถ้ายังไม่มีข้อมูลให้ fix ไว้ก่อน
        checkOut: "No",
        evaluated: "No",
<<<<<<< HEAD
        selectedfood: s.selectedfood,
=======
>>>>>>> b18dec3 (add recomend activity (no store))
      }));

      set({ enrolledStudents: mappedStudents });
      console.log("✅ Mapped enrolled students:", mappedStudents);
    } catch (error) {
      console.error("❌ Error fetching enrolled students:", error);
      set({ enrolledStudents: [] });
    }
  },

  createActivity: async (activity: ApiActivity): Promise<void> => {
    set(() => ({ activityLoading: true, activityError: null }));

    try {
      console.log("log in createActivity Store: ", activity);

      await axiosInstance.post("/admin/activity/create-activity", activity);
<<<<<<< HEAD
      toast.success(
        activity.ac_status === "Public"
          ? "สร้างกิจกรรมสำเร็จ !"
          : "ร่างกิจกรรมสำเร็จ !",
        { duration: 3000 }
      );
=======
>>>>>>> b18dec3 (add recomend activity (no store))
      set((state) => ({
        activities: [...state.activities, mapActivityData(activity)],
        activityLoading: false,
        enrolledStudents: [],
      });
    }
  },
}));

<<<<<<< HEAD
function forceToArray(input: unknown): string[] {
  if (typeof input !== "string") return [];

  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parsed;
  } catch {
=======
function forceToArray(input: string): string[] {
  try {
    // ลอง parse แบบ array ปกติก่อน
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ถ้า parse ไม่ได้ เช่น {"ข้าว"} → ตัด {} และ " ออก
>>>>>>> b18dec3 (add recomend activity (no store))
    const cleaned = input.replace(/[{}"]/g, "").trim();
    if (cleaned) return [cleaned];
  }

  return [];
}
