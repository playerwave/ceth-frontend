// stores/EventCoop/eventCoop.service.ts
import axiosInstance from "@/libs/axios";
import { EventCoop } from "@/types/eventcoop.type";

//base path
const TEACHER_EVENT_COOP_PATH = "/teacher/event-coop";

//--------------------- Fetch Event Coops -------------------------
export const fetchAllEventCoops = async (): Promise<EventCoop[]> => {
  try {
    const response = await axiosInstance.get<{
      success: boolean;
      message: string;
      data: EventCoop[];
      count: number;
    }>(`${TEACHER_EVENT_COOP_PATH}/get-event-coops`);
    
    // ✅ ตรวจสอบ response structure
    if (!response.data || !response.data.success || !Array.isArray(response.data.data)) {
      console.warn("⚠️ Invalid response structure from API:", response.data);
      return [];
    }
    
    console.log(`✅ fetchAllEventCoops: Retrieved ${response.data.data.length} event coops`);
    return response.data.data; // ✅ ใช้ response.data.data แทน response.data
  } catch (error) {
    console.error("❌ fetchAllEventCoops error:", error);
    
    // ✅ ตรวจสอบ error type และ return appropriate response
    if (error instanceof Error) {
      if (error.message.includes('Network Error') || error.message.includes('timeout')) {
        console.warn("⚠️ Network error, returning empty array");
        return [];
      }
    }
    
    // ✅ Re-throw error เพื่อให้ store จัดการ
    throw error;
  }
};
//----------------------------------------------------------------

//--------------------- Get Event Coop By Id -------------------------
export const getEventCoopById = async (id: number): Promise<EventCoop> => {
  const response = await axiosInstance.get<{
    success: boolean;
    message: string;
    data: EventCoop;
  }>(`${TEACHER_EVENT_COOP_PATH}/get-event-coop/${id}`);
  
  console.log("🔍 Event Coop data service:", response.data);
  
  // ✅ ตรวจสอบ response structure
  if (!response.data || !response.data.success || !response.data.data) {
    console.warn("⚠️ Invalid response structure from API:", response.data);
    throw new Error("Invalid response structure");
  }
  
  return response.data.data; // ✅ ใช้ response.data.data แทน response.data
};
//------------------------------------------------------------------

//--------------------- Get Event Coops By Department -------------------------
export const getEventCoopsByDepartment = async (departmentId: number): Promise<EventCoop[]> => {
  try {
    const response = await axiosInstance.get<{
      success: boolean;
      message: string;
      data: EventCoop[];
      count: number;
    }>(`${TEACHER_EVENT_COOP_PATH}/get-event-coops-by-department/${departmentId}`);
    
    // ✅ ตรวจสอบ response structure
    if (!response.data || !response.data.success || !Array.isArray(response.data.data)) {
      console.warn("⚠️ Invalid response structure from API:", response.data);
      return [];
    }
    
    console.log(`✅ getEventCoopsByDepartment: Retrieved ${response.data.data.length} event coops for department ${departmentId}`);
    return response.data.data; // ✅ ใช้ response.data.data แทน response.data
  } catch (error) {
    console.error("❌ getEventCoopsByDepartment error:", error);
    throw error;
  }
};
//------------------------------------------------------------------

//--------------------- Create Event Coop ----------------------------
export const createEventCoop = async (
  payload: Partial<EventCoop>
): Promise<number> => {
  console.log("📤 Creating event coop with payload:", payload);

  const response = await axiosInstance.post<{
    success: boolean;
    message: string;
    data: EventCoop;
  }>(`${TEACHER_EVENT_COOP_PATH}/create-event-coop`, payload);
  
  console.log("📥 Create event coop response:", response.data);
  
  // ✅ ตรวจสอบ response structure
  if (!response.data || !response.data.success || !response.data.data) {
    console.warn("⚠️ Invalid response structure from API:", response.data);
    throw new Error("Invalid response structure");
  }
  
  return response.data.data.eventcoop_id; // ✅ ใช้ response.data.data.eventcoop_id
};
//------------------------------------------------------------------

//--------------------- Update Event Coop ----------------------------
export const updateEventCoop = async (eventCoop: EventCoop): Promise<number> => {
  console.log("🚀 [SERVICE] Sending updateEventCoop payload to backend:", eventCoop);
  const response = await axiosInstance.patch<{
    success: boolean;
    message: string;
    data: EventCoop;
  }>(`${TEACHER_EVENT_COOP_PATH}/update-event-coop/${eventCoop.eventcoop_id}`, {
    ...eventCoop,
  });
  
  console.log("✅ [SERVICE] Backend response for updateEventCoop:", response.data);
  
  // ✅ ตรวจสอบ response structure
  if (!response.data || !response.data.success || !response.data.data) {
    console.warn("⚠️ Invalid response structure from API:", response.data);
    throw new Error("Invalid response structure");
  }
  
  return response.data.data.eventcoop_id; // ✅ ใช้ response.data.data.eventcoop_id
};
//--------------------------------------------------------------------

//--------------------- Delete Event Coop ----------------------------
export const deleteEventCoop = async (id: number): Promise<void> => {
  console.log("🗑️ Deleting event coop with ID:", id);
  const response = await axiosInstance.delete<{
    success: boolean;
    message: string;
  }>(`${TEACHER_EVENT_COOP_PATH}/delete-event-coop/${id}`);
  
  console.log("✅ Delete event coop response:", response.data);
  
  // ✅ ตรวจสอบ response structure
  if (!response.data || !response.data.success) {
    console.warn("⚠️ Invalid response structure from API:", response.data);
    throw new Error("Invalid response structure");
  }
};
//------------------------------------------------------------------

//--------------------- Export Service -----------------------------
// เป็นการทำ Object literal เพื่อรวมฟังก์ชันทั้งหมดที่เกี่ยวข้องกับ event coop
const eventCoopService = {
  fetchAllEventCoops,
  getEventCoopById,
  getEventCoopsByDepartment,
  createEventCoop,
  updateEventCoop,
  deleteEventCoop,
};
//------------------------------------------------------------------

export default eventCoopService;
