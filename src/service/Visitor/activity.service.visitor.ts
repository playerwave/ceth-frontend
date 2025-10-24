// src/service/Visitor/activity.service.visitor.ts

import axiosInstance from "@/libs/axios";
import { Activity } from "@/types/activity.types";

const API_URL_FOR_VISITOR = "/visitor"; // ✅ ใช้ relative path เพราะ axios instance มี baseURL แล้ว

// ✅ ลบ function ที่ไม่ใช้แล้ว

const fetchPublicActivities = async (): Promise<Activity[]> => {
  // คืนค่าเป็น Activity[]
  console.log("🚀🚀🚀 [Service] fetchPublicActivities called 🚀🚀🚀");
  console.log("🚀🚀🚀 [Service] API_URL_FOR_VISITOR:", API_URL_FOR_VISITOR);
  console.log("🚀🚀🚀 [Service] Full URL:", `${API_URL_FOR_VISITOR}/get-visitor-activities`);
  try {
    console.log("🚀🚀🚀 [Service] SENDING REQUEST NOW to /api/visitor/get-visitor-activities 🚀🚀🚀");
    const response = await axiosInstance.get<any[]>(
      `${API_URL_FOR_VISITOR}/get-visitor-activities`
    );
    console.log("✅✅✅ [Service] API RESPONSE RECEIVED:", response);
    console.log("✅✅✅ [Service] Response data:", response.data);
    console.log("✅✅✅ [Service] Response status:", response.status);

    // ✅ ตรวจสอบ response data
    if (!response.data) {
      console.warn("API returned no data");
      return [];
    }

    // ✅ ตรวจสอบว่า response.data เป็น array หรือไม่
    if (!Array.isArray(response.data)) {
      console.warn("API returned non-array data:", response.data);
      return [];
    }

    const rawData: any[] = response.data;

    if (!rawData || rawData.length === 0) {
      console.warn("API returned no data or empty array.");
      return [];
    }

    // ✅ แปลงข้อมูลจาก Backend format เป็น Activity format
    const activities: Activity[] = rawData.map((item) => {
      return {
        activity_id: parseInt(item.activity_id) || 0,
        activity_name: item.activity_name || "",
        presenter_company_name: item.presenter_company_name || "",
        type: item.type || "Soft",
        description: item.description || "",
        seat: parseInt(item.seat) || 0,
        recieve_hours: parseInt(item.recieve_hours) || 0,
        event_format: item.event_format || "Onsite",
        create_activity_date: item.create_activity_date || "",
        special_start_register_date: item.special_start_register_date || "",
        start_register_date: item.start_register_date || "",
        end_register_date: item.end_register_date || "",
        start_activity_date: item.start_activity_date || "",
        end_activity_date: item.end_activity_date || "",
        image_url: item.image_url || "",
        activity_status: item.activity_status || "Private",
        activity_state: item.activity_state || "Not Start",
        status: "Active",
        last_update_activity_date: item.last_update_activity_date || "",
        url: item.url || null,
        assessment_id: parseInt(item.assessment_id) || 0,
        room_id: parseInt(item.room_id) || 0,
        start_assessment: item.start_assessment || null,
        end_assessment: item.end_assessment || null,
        activityFood: [],
        registered_count: parseInt(item.registered_count) || 0,
      };
    });

    console.log("Converted Activities for Table:", activities);
    return activities;
  } catch (error) {
    console.error("❌❌❌ [Service] ERROR fetching activities:", error);
    console.error("❌❌❌ [Service] Error details:", error);
    
    // ✅ ตรวจสอบ error type
    if (error instanceof Error) {
      throw new Error(`Failed to fetch and process public activities data: ${error.message}`);
    } else {
      throw new Error("Failed to fetch and process public activities data.");
    }
  }
};

export const activityService = {
  fetchPublicActivities,
};
