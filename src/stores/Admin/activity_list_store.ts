import { create } from "zustand";
<<<<<<< HEAD
import { ActivityState, Activity } from "../../types/Admin/activity_list_type";
import {
  fetchActivities as fetchActivitiesService,
  searchActivities as searchActivitiesService,
  fetchActivity as fetchActivityService,
} from "../../service/Admin/activity_list_service";
=======
import { ActivityState } from "../../types/Admin/activity_list_type";
import { Activity } from "../../types/Student/activity_list_studen_type";

// 🔁 import service ที่คุณสร้างไว้
import {
  fetchActivities as fetchActivitiesService,
  fetchActivity as fetchActivityService,
  searchActivities as searchActivitiesService,
} from "../../service/Admin/activity_list_service"; // ✅ << ปรับ path ให้ตรง
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  searchResults: null,
  activityError: null,
  activityLoading: false,
  activity: null,
<<<<<<< HEAD
  enrolledStudents: [],

  mockActivities: [
    {
      id: "e1",
      name: "กิจกรรมพัฒนาศักยภาพนิสิต",
      company_lecturer: "คุณศุภชัย สอนดี",
      description: "",
      type: "Soft Skill",
      room: "Room A101",
      seat: 80,
      food: [],
      status: "Public",
      location_type: "Onsite",
      date: null,
      start_register: new Date("2025-05-20T08:00:00"),
      end_register: new Date("2025-05-25T10:00:00"),
      create_date: null,
      last_update: null,
      registered_count: 80,
      attended_count: 75,
      not_attended_count: 5,
      start_time: new Date("2025-05-25T13:00:00"),
      end_time: new Date("2025-05-25T16:00:00"), // ✅ ผ่านไปแล้ว
      image_url: "",
      state: "active",
      normal_register: null,
      recieve_hours: 3,
      start_assessment: new Date("2025-05-25T16:00:00"),
      end_assessment: new Date("2025-06-10T23:59:59"), // ✅ ยังไม่หมด
      assessment_id: null,
      register_start_normal: new Date("2025-05-15T00:00:00"),
      requiredFieldsFilled: true,
      activity_state: "On Going",
      assessment: null,
    },
    {
      id: "e2",
      name: "การใช้เครื่องมือวิเคราะห์ข้อมูลเบื้องต้น",
      company_lecturer: "ดร.สมปอง ทองดี",
      description: "",
      type: "Hard Skill",
      room: "Lab 204",
      seat: 50,
      food: [],
      status: "Private",
      location_type: "Online",
      date: null,
      start_register: new Date("2025-05-18T10:00:00"),
      end_register: new Date("2025-05-22T17:00:00"),
      create_date: null,
      last_update: null,
      registered_count: 45,
      attended_count: 40,
      not_attended_count: 5,
      start_time: new Date("2025-05-23T09:00:00"),
      end_time: new Date("2025-05-23T12:00:00"), // ✅ จบแล้ว
      image_url: "",
      state: "active",
      normal_register: null,
      recieve_hours: 2,
      start_assessment: new Date("2025-05-23T12:00:00"),
      end_assessment: new Date("2025-06-07T23:59:59"), // ✅ ยังไม่หมด
      assessment_id: null,
      register_start_normal: new Date("2025-05-10T00:00:00"),
      requiredFieldsFilled: true,
      activity_state: "On Going",
      assessment: null,
    },
    {
      id: "e3",
      name: "อบรม JavaScript เบื้องต้น",
      company_lecturer: "คุณศิริพร เขียนดี",
      description: "",
      type: "Hard Skill",
      room: "Online Zoom",
      seat: 40,
      food: [],
      status: "Public",
      location_type: "Online",
      date: null,
      start_register: new Date("2025-06-02T08:00:00"),
      end_register: new Date("2025-06-03T09:00:00"),
      create_date: null,
      last_update: null,
      registered_count: 40,
      attended_count: 35,
      not_attended_count: 5,
      start_time: new Date("2025-06-04T06:00:00"),
      end_time: new Date("2025-06-04T09:00:00"), // ❌ ยังไม่จบ
      image_url: "",
      state: "active",
      normal_register: null,
      recieve_hours: 2,
      start_assessment: new Date("2025-06-04T09:00:00"),
      end_assessment: new Date("2025-06-12T23:59:59"), // ✅
      assessment_id: null,
      register_start_normal: new Date("2025-06-01T00:00:00"),
      requiredFieldsFilled: true,
      activity_state: "Not Start",
      assessment: null,
    },
    {
      id: "e4",
      name: "กิจกรรมเสริมทักษะ AI",
      company_lecturer: "ทีม AI Lab",
      description: "",
      type: "Soft Skill",
      room: "Auditorium",
      seat: 100,
      food: [],
      status: "Private",
      location_type: "Onsite",
      date: null,
      start_register: new Date("2025-05-15T08:00:00"),
      end_register: new Date("2025-05-20T10:00:00"),
      create_date: null,
      last_update: null,
      registered_count: 100,
      attended_count: 90,
      not_attended_count: 10,
      start_time: new Date("2025-05-20T13:00:00"),
      end_time: new Date("2025-05-20T16:00:00"), // ✅ จบแล้ว
      image_url: "",
      state: "active",
      normal_register: null,
      recieve_hours: 3,
      start_assessment: new Date("2025-05-20T16:00:00"),
      end_assessment: new Date("2025-06-01T23:59:59"), // ❌ หมดแล้ว
      assessment_id: null,
      register_start_normal: new Date("2025-05-10T00:00:00"),
      requiredFieldsFilled: true,
      activity_state: "Ended",
      assessment: null,
    },
    {
      id: "e5",
      name: "Workshop ออกแบบ UX/UI",
      company_lecturer: "บริษัท DesignX",
      description: "",
      type: "Hard Skill",
      room: "Studio B",
      seat: 35,
      food: [],
      status: "Public",
      location_type: "Course",
      date: null,
      start_register: new Date("2025-06-01T08:00:00"),
      end_register: new Date("2025-06-03T10:00:00"),
      create_date: null,
      last_update: null,
      registered_count: 35,
      attended_count: 34,
      not_attended_count: 1,
      start_time: new Date("2025-06-03T13:00:00"),
      end_time: null, // ❌ ขาด end_time
      image_url: "",
      state: "active",
      normal_register: null,
      recieve_hours: 2,
      start_assessment: new Date("2025-06-03T14:00:00"),
      end_assessment: new Date("2025-06-06T23:59:59"), // ✅
      assessment_id: null,
      register_start_normal: new Date("2025-06-01T00:00:00"),
      requiredFieldsFilled: true,
      activity_state: "On Going",
      assessment: null,
    },
  ],
=======
  enrolledActivities: [],
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e

  fetchActivities: async () => {
    set({ activityLoading: true, activityError: null });
    try {
<<<<<<< HEAD
      const activities = await fetchActivitiesService("yourUserId");
=======
      const activities = await fetchActivitiesService("yourUserId"); // ✅ ใส่ userId ถ้า service ต้องการ
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e
      set({ activities, activityLoading: false });
    } catch (error) {
      console.error("❌ Error fetching activities:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมได้",
        activityLoading: false,
      });
    }
  },

  searchActivities: async (searchName: string) => {
    if (!searchName.trim()) {
      await get().fetchActivities();
      set({ searchResults: null });
      return;
    }

    set({ activityLoading: true, activityError: null });
    try {
      const results = await searchActivitiesService(searchName);
      set({ searchResults: results, activityLoading: false });
    } catch (error) {
      console.error("❌ Error searching activities:", error);
      set({
        activityError: "ไม่สามารถค้นหากิจกรรมได้",
        activityLoading: false,
      });
    }
  },

<<<<<<< HEAD
  fetchActivity: async (id: number | string) => {
    set({ activityLoading: true, activityError: null });
    try {
      const activity = await fetchActivityService(id);
      set({ activity, activityLoading: false });
=======
  fetchActivity: async (id: number | string): Promise<Activity | null> => {
    set({ activityLoading: true, activityError: null });
    try {
      const activity = await fetchActivityService(id, "yourUserId");
      set({ activity, activityLoading: false });
      return activity;
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e
    } catch (error) {
      console.error("❌ Error fetching activity:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมนี้ได้",
        activityLoading: false,
      });
<<<<<<< HEAD
    }
  },

  fetchEnrolledStudents: async (id: number | string) => {
    try {
      const students = await fetchEnrolledStudentsService(id);
      set({ enrolledStudents: students });
    } catch (error) {
      console.error("❌ Error fetching enrolled students:", error);
    }
  },

  updateActivity: async (activity: Activity) => {
    try {
      await updateActivityService(activity);
      await get().fetchActivities();
    } catch (error) {
      console.error("❌ Error updating activity:", error);
    }
  },

  updateActivityStatus: async (id: string, status: "Public" | "Private") => {
    try {
      // คุณสามารถเพิ่ม service จริงในนี้ได้ตามหลัง
      console.log(`Update status of activity ${id} to ${status}`);
      const updated = get().mockActivities.map((a) =>
        a.id === id ? { ...a, status } : a
      );
      set({ mockActivities: updated });
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
  },

  createActivity: async (activity) => {
    try {
      await createActivityService(activity);
      await get().fetchActivities();
    } catch (error) {
      console.error("❌ Error creating activity:", error);
    }
  },

  setMockActivities: (activities: Activity[]) => {
    set({ mockActivities: activities });
  },
=======
      return null;
    }
  },
>>>>>>> 4c8b22d56c55abbf22dfae39e77e0dda7526dc4e
}));
