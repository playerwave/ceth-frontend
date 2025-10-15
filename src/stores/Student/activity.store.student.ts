// src/stores/activityStore.ts
import { create } from "zustand";
import { ActivityState } from "../state/activity.state";
import activityService from "../../service/Student/activity.service";
// import { Activity } from "../../types/model";

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  searchResults: null,
  activityError: null,
  activityLoading: false,
  activity: null,
  enrolledActivities: [],
  ongoingActivities: [],
  recommendedIds: [],
  endedActivities: [],

  // โหลดกิจกรรมทั้งหมดของนิสิต
  fetchStudentActivities: async (studentId: number) => {
    console.log("🚀🚀🚀 [STORE] fetchStudentActivities called with studentId:", studentId);

    // ตรวจสอบว่ากำลังโหลดอยู่หรือไม่ เพื่อป้องกันการเรียกซ้ำ
    const currentState = get();
    if (currentState.activityLoading) {
      console.log("⚠️ [STORE] Already loading, skipping duplicate call");
      return;
    }

    console.log("🚀🚀🚀 [STORE] Setting loading state and calling service...");
    set({ activityLoading: true, activityError: null });
    try {
      console.log("🚀🚀🚀 [STORE] CALLING activityService.fetchActivities NOW!");
      const activities = await activityService.fetchActivities(studentId);
      console.log("✅✅✅ [STORE] Activities received:", activities);
      console.log("✅✅✅ [STORE] Activities count:", activities?.length);

      // ตรวจสอบว่า activities ไม่เป็น null หรือ undefined
      if (activities && Array.isArray(activities)) {
        set({ activities, activityLoading: false });
        console.log(
          "✅ [STORE] Activities set successfully, count:",
          activities.length
        );
      } else {
        console.warn(
          "⚠️ [STORE] Invalid activities data received:",
          activities
        );
        set({ activities: [], activityLoading: false });
      }
    } catch (error) {
      console.error("❌ Error fetching student activities:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมนิสิตได้",
        activityLoading: false,
      });
    }
  },

  // ค้นหากิจกรรม
  searchActivities: async (searchName: string, studentId: number) => {
    if (!searchName.trim()) {
      await get().fetchStudentActivities(studentId);
      set({ searchResults: null });
      return;
    }

    set({ activityLoading: true, activityError: null });
    try {
      const searchResults = await activityService.searchActivities(searchName);
      set({ searchResults, activityLoading: false });
    } catch (error) {
      console.error("❌ Error searching activities:", error);
      set({
        activityError: "ไม่สามารถค้นหากิจกรรมได้",
        activityLoading: false,
      });
    }
  },

  // โหลดกิจกรรมแนะนำ
  fetchRecommended: async (studentId: number) => {
    try {
      const ids = await activityService.fetchRecommendedIds(studentId);
      set({ recommendedIds: ids });
    } catch (error) {
      console.error("❌ Error fetching recommended IDs:", error);
      set({ activityError: "ไม่สามารถโหลดกิจกรรมแนะนำได้" });
    }
  },

  // โหลดกิจกรรมเดี่ยว
  fetchActivity: async (id: number | string) => {
    set({ activityLoading: true, activityError: null });
    try {
      const activity = await activityService.fetchActivity(id);
      set({ activity, activityLoading: false });
      return activity;
    } catch (error) {
      console.error("❌ Error fetching activity:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมนี้ได้",
        activityLoading: false,
      });
      return null;
    }
  },
  fetchEnrolledActivities: async (studentId: number) => {
    console.log(
      "🔄 [STORE] fetchEnrolledActivities called with studentId:",
      studentId
    );

    // ตรวจสอบว่ากำลังโหลดอยู่หรือไม่ เพื่อป้องกันการเรียกซ้ำ
    const currentState = get();
    if (currentState.activityLoading) {
      console.log("⚠️ [STORE] Already loading, skipping duplicate call");
      return;
    }

    set({ activityLoading: true, activityError: null });

    try {
      // เพิ่ม timeout 10 วินาที
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 10000);
      });

      const activitiesPromise =
        activityService.fetchEnrolledActivities(studentId);
      const activities = (await Promise.race([
        activitiesPromise,
        timeoutPromise,
      ])) as any[];

      console.log("✅ [STORE] Enrolled activities received:", activities);

      // ตรวจสอบว่า activities เป็น array ที่ถูกต้อง
      if (activities && Array.isArray(activities)) {
        set({ enrolledActivities: activities, activityLoading: false });
        console.log(
          "✅ [STORE] Enrolled activities set successfully, count:",
          activities.length
        );
      } else {
        console.warn(
          "⚠️ [STORE] Invalid enrolled activities data:",
          activities
        );
        set({ enrolledActivities: [], activityLoading: false });
      }
    } catch (error) {
      console.error("❌ [STORE] Error in fetchEnrolledActivities:", error);
      const errorMessage =
        (error as any).message === "Request timeout"
          ? "การเชื่อมต่อช้า กรุณาลองใหม่อีกครั้ง"
          : "ไม่สามารถโหลดกิจกรรมที่ลงทะเบียนได้";

      set({
        activityError: errorMessage,
        activityLoading: false,
      });
    }
  },

  fetchOngoingActivities: async (studentId: number) => {
    console.log(
      "🔄 [STORE] fetchOngoingActivities called with studentId:",
      studentId
    );

    // ตรวจสอบว่ากำลังโหลดอยู่หรือไม่ เพื่อป้องกันการเรียกซ้ำ
    const currentState = get();
    if (currentState.activityLoading) {
      console.log("⚠️ [STORE] Already loading, skipping duplicate call");
      return;
    }

    console.log("✅ [STORE] Starting fetchOngoingActivities...");
    set({ activityLoading: true, activityError: null });

    try {
      // เพิ่ม timeout 10 วินาที
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 10000);
      });

      const activitiesPromise =
        activityService.fetchOngoingActivities(studentId);
      const activities = (await Promise.race([
        activitiesPromise,
        timeoutPromise,
      ])) as any[];

      console.log("✅ [STORE] Ongoing activities received:", activities);

      // ตรวจสอบว่า activities เป็น array ที่ถูกต้อง
      if (activities && Array.isArray(activities)) {
        set({ ongoingActivities: activities, activityLoading: false });
        console.log(
          "✅ [STORE] Ongoing activities set successfully, count:",
          activities.length
        );
      } else {
        console.warn(
          "⚠️ [STORE] Invalid ongoing activities data:",
          activities
        );
        set({ ongoingActivities: [], activityLoading: false });
      }
    } catch (error) {
      console.error("❌ [STORE] Error in fetchOngoingActivities:", error);
      const errorMessage =
        (error as any).message === "Request timeout"
          ? "การเชื่อมต่อช้า กรุณาลองใหม่อีกครั้ง"
          : "ไม่สามารถโหลดกิจกรรมที่กำลังดำเนินอยู่ได้";

      set({
        activityError: errorMessage,
        activityLoading: false,
      });
    }
  },

  enrollActivity: async (
    studentId: number,
    activityId: number,
    food?: string[]
  ) => {
    set({ activityLoading: true, activityError: null });
    try {
      console.log("in store");

      console.log("studentId: ", studentId);
      console.log("activityId: ", activityId);
      console.log("food: ", food);

      await activityService.enrollActivity(studentId, activityId, food);
      set({ activityLoading: false });
      // อาจจะ fetchEnrolledActivities(studentId) ซ้ำเพื่อ refresh
    } catch {
      set({
        activityError: "ไม่สามารถสมัครกิจกรรมได้",
        activityLoading: false,
      });
    }
  },

  unenrollActivity: async (studentId: number, activityId: number) => {
    set({ activityLoading: true, activityError: null });
    try {
      await activityService.unEnrollActivity(studentId, activityId);
      set({ activityLoading: false });
      // อาจจะ fetchEnrolledActivities(studentId) ซ้ำเพื่อ refresh
    } catch {
      set({
        activityError: "ไม่สามารถยกเลิกกิจกรรมได้",
        activityLoading: false,
      });
    }
  },

  // ✅ เมธอดใหม่: โหลดกิจกรรมที่สิ้นสุด และบังคับตั้ง activity_state ตาม event_format
  //   fetchEndedActivities: async (studentId: number) => {
  //   const { activityLoading } = get();
  //   if (activityLoading) return;

  //   set({ activityLoading: true, activityError: null });
  //   try {
  //     const raw = await activityService.fetchActivities(studentId);
  //     const ended = Array.isArray(raw)
  //       ? raw.map((a: any) => ({
  //           ...a,
  //           activity_state: a?.event_format === "Course" ? "End Activity" : "End Assessment",
  //         }))
  //       : [];
  //     set({ endedActivities: ended, activityLoading: false });
  //   } catch (e: any) {
  //     set({
  //       activityError: e?.response?.data?.message || e?.message || "ไม่สามารถโหลดกิจกรรมที่สิ้นสุดได้",
  //       activityLoading: false,
  //     });
  //   }
  // },

  fetchEndedActivities: async (studentId: number) => {
    console.log(
      "🚀 [STORE] fetchEndedActivities called with studentId:",
      studentId
    );

    const { activityLoading } = get();
    if (activityLoading) {
      console.log("⚠️ [STORE] Already loading, skip");
      return;
    }

    set({ activityLoading: true, activityError: null });

    try {
      // ถ้า service ฝั่งหลังบ้านคืน “กิจกรรมที่สิ้นสุดแล้ว” อยู่แล้ว
      const ended = await activityService.fetchEndActivities(studentId);

      console.log("📥 [STORE] Ended activities received:", ended);

      if (Array.isArray(ended)) {
        set({ endedActivities: ended, activityLoading: false });
        console.log("✅ [STORE] endedActivities set, count:", ended.length);
      } else {
        console.warn("⚠️ [STORE] Invalid ended activities data:", ended);
        set({ endedActivities: [], activityLoading: false });
      }
    } catch (error) {
      console.error("❌ [STORE] Error in fetchEndedActivities:", error);
      set({
        activityError: "ไม่สามารถโหลดกิจกรรมที่สิ้นสุดได้",
        activityLoading: false,
      });
    }
  },

  searchEndActivities: async (searchName: string, studentId: number) => {
    const q = searchName.trim().toLowerCase();

    // ถ้าคำค้นว่าง → กลับไปใช้ endedActivities
    if (!q) {
      // โหลดให้ชัวร์ (เผื่อยังไม่ได้โหลด)
      if (!get().endedActivities || get().endedActivities.length === 0) {
        await get().fetchEndedActivities(studentId);
      }
      set({ searchResults: null }); // ให้ตาราง fallback เป็น endedActivities
      return;
    }

    // ✅ กรองจาก endedActivities ที่มีอยู่
    const ended = (get().endedActivities ?? []) as any[];
    const searchResults = ended.filter((row) => {
      const text = [
        row.presenter_company_name,
        row.activity_name,
        row.company_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(q);
    });

    set({ searchResults }); // ถ้าอยาก fallback เมื่อไม่เจอ → set({ searchResults: null })
  },

  // ✅ เมธอดใหม่: Check-in/Check-out Activity
  checkInOutActivity: async (
    activityId: number,
    username: string,
    password: string
  ) => {
    set({ activityLoading: true, activityError: null });
    try {
      const result = await activityService.checkInOutActivity(activityId, username, password);
      set({ activityLoading: false });
      return result;
    } catch (error: any) {
      console.error("❌ Error in checkInOutActivity:", error);
      set({
        activityError: error.message || "ไม่สามารถลงทะเบียนเข้าร่วมกิจกรรมได้",
        activityLoading: false,
      });
      throw error;
    }
  },

  // ✅ เมธอดใหม่: เช็คสถานะการทำแบบประเมิน
  checkAssessmentStatus: async (activityId: number, studentId: number) => {
    console.log("🔍 [STORE] checkAssessmentStatus called with:", { activityId, studentId });
    set({ activityLoading: true, activityError: null });
    try {
      console.log("🔄 [STORE] Calling activityService.checkAssessmentStatus...");
      const result = await activityService.checkAssessmentStatus(activityId, studentId);
      console.log("✅ [STORE] Assessment status result:", result);
      set({ activityLoading: false });
      return result;
    } catch (error: any) {
      console.error("❌ [STORE] Error in checkAssessmentStatus:", error);
      set({
        activityError: error.message || "ไม่สามารถเช็คสถานะแบบประเมินได้",
        activityLoading: false,
      });
      throw error;
    }
  },
}));
