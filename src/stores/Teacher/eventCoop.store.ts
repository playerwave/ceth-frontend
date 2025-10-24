import { create } from "zustand";
import { EventCoop } from "@/types/eventcoop.type";
import eventCoopService from "@/service/Teacher/eventCoop.service";

interface EventCoopStore {
  eventCoops: EventCoop[];
  selectedEventCoop: EventCoop | null;
  loading: boolean;
  error: string | null;
  eventCoopLoading: boolean;
  eventCoopError: string | null;
  eventCoop: EventCoop | null;
  searchResults: EventCoop[] | null;

  // Functions
  fetchEventCoops: () => Promise<void>;
  selectEventCoop: (id: number) => Promise<void>;
  clearSelectedEventCoop: () => void;
  createEventCoop: (eventCoop: Partial<EventCoop>) => Promise<number | undefined>;
  updateEventCoop: (eventCoop: EventCoop) => Promise<number | undefined>;
  deleteEventCoop: (id: number) => Promise<void>;
  searchEventCoops: (searchName: string) => Promise<void>;
  fetchEventCoop: (id: number) => Promise<EventCoop | null>;
  getEventCoopsByDepartment: (departmentId: number) => Promise<EventCoop[]>;
}

export const useEventCoopStore = create<EventCoopStore>((set) => ({
  eventCoops: [],
  selectedEventCoop: null,
  loading: false,
  error: null,
  eventCoopLoading: false,
  eventCoopError: null,
  eventCoop: null,
  searchResults: null,

  //------------------------------------------- Role: Teacher --------------------------------------------------

  //--------------------- Create Event Coop -------------------------
  //สร้าง Event Coop ใหม่
  createEventCoop: async (eventCoopData) => {
    console.log("📤 createEventCoop payload:", eventCoopData);
    set({ loading: true, error: null });
    try {
      const result = await eventCoopService.createEventCoop(eventCoopData);
      const updatedList = await eventCoopService.fetchAllEventCoops(); // อัปเดตรายการ
      set({ eventCoops: updatedList });
      return result; // ✅ ส่งคืน eventcoop_id
    } catch (err) {
      set({ error: "Failed to create event coop" });
      throw err; // ✅ re-throw error
    } finally {
      set({ loading: false });
    }
  },
  //----------------------------------------------------------------

  //--------------------- Fetch Event Coops -------------------------
  //ดึงรายการ Event Coop ทั้งหมดสำหรับอาจารย์
  fetchEventCoops: async () => {
    console.log("📥 Fetching all event coops for teacher...");

    set({ loading: true, error: null, eventCoopLoading: true, eventCoopError: null });
    
    let retries = 3;
    while (retries > 0) {
      try {
        const data = await eventCoopService.fetchAllEventCoops();
        
        // ✅ ตรวจสอบข้อมูลที่ได้
        if (!data || !Array.isArray(data)) {
          console.warn("⚠️ Invalid data received from service:", data);
          if (retries > 1) {
            retries--;
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          set({ eventCoops: [], loading: false, eventCoopLoading: false });
          return;
        }

        set({ eventCoops: data, loading: false, eventCoopLoading: false });
        console.log(`✅ teacher fetchEventCoops: Retrieved ${data.length} event coops`);
        return;
      } catch (err) {
        retries--;
        console.error(`❌ fetchEventCoops error (retries left: ${retries}):`, err);
        
        if (retries === 0) {
          const errorMessage = err instanceof Error ? err.message : "Failed to fetch event coops";
          set({ 
            error: errorMessage, 
            eventCoopError: errorMessage,
            loading: false, 
            eventCoopLoading: false 
          });
          return;
        }
        
        // ✅ รอสักครู่ก่อนลองใหม่
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  },
  //----------------------------------------------------------------

  //--------------------- Select Event Coop -------------------------
  selectEventCoop: async (id: number) => {
    console.log("📥 Selecting event coop with ID:", id);
    set({ loading: true });
    try {
      const eventCoop = await eventCoopService.getEventCoopById(id);
      set({ selectedEventCoop: eventCoop });
    } catch (err) {
      set({ error: "Failed to fetch event coop details" });
    } finally {
      set({ loading: false });
    }
  },
  //----------------------------------------------------------------

  clearSelectedEventCoop: () => set({ selectedEventCoop: null }),
  //----------------------------------------------------------------

  //--------------------- Search Event Coops -------------------------
  searchEventCoops: async (searchName: string) => {
    console.log("🔍 Searching event coops with name:", searchName);
    if (!searchName.trim()) {
      await useEventCoopStore.getState().fetchEventCoops();
      set({ searchResults: null });
      return;
    }

    set({ eventCoopLoading: true, eventCoopError: null });
    try {
      // ใช้การค้นหาในข้อมูลที่มีอยู่
      const allEventCoops = await eventCoopService.fetchAllEventCoops();
      const results = allEventCoops.filter(eventCoop => 
        eventCoop.department_id.toString().includes(searchName) ||
        eventCoop.grade_id.toString().includes(searchName)
      );
      set({ searchResults: results });
    } catch (error) {
      console.error("❌ Error searching event coops:", error);
      set({ eventCoopError: "ไม่สามารถค้นหา Event Coop ได้" });
    } finally {
      set({ eventCoopLoading: false });
    }
  },
  //----------------------------------------------------------------

  //--------------------- Fetch Event Coop ---------------------------
  fetchEventCoop: async (id: number) => {
    console.log("📥 Fetching event coop with ID:", id);

    set({ eventCoopLoading: true, eventCoopError: null });
    try {
      const eventCoop = await eventCoopService.getEventCoopById(id);
      set({ eventCoop });
      return eventCoop; // ✅ ส่งคืนข้อมูล eventCoop
    } catch (error) {
      console.error("❌ Error fetching event coop:", error);
      set({ eventCoopError: "ไม่สามารถโหลด Event Coop นี้ได้" });
      return null;
    } finally {
      set({ eventCoopLoading: false });
    }
  },
  //----------------------------------------------------------------

  //--------------------- updateEventCoop ---------------------------
  updateEventCoop: async (eventCoop: EventCoop) => {
    try {
      const result = await eventCoopService.updateEventCoop(eventCoop);
      
      // อัปเดต state โดยตรงแทนการ refresh ทั้งหมด
      set((state) => ({
        eventCoops: state.eventCoops.map(ec => 
          ec.eventcoop_id === eventCoop.eventcoop_id 
            ? { ...ec, date: eventCoop.date, is_on_coop: eventCoop.is_on_coop } 
            : ec
        )
      }));
      
      return result; // ✅ ส่งคืน eventcoop_id
    } catch (error) {
      console.error("❌ Error updating event coop:", error);
      throw error; // ✅ re-throw error
    }
  },
  //----------------------------------------------------------------

  //--------------------- deleteEventCoop -----------------------
  deleteEventCoop: async (id: number) => {
    console.log("🗑️ Store: Deleting event coop with ID:", id);
    try {
      await eventCoopService.deleteEventCoop(id);
      console.log("✅ Store: Event coop deleted successfully");
      // โหลดรายการ Event Coop ใหม่หลังจากลบ
      await useEventCoopStore.getState().fetchEventCoops();
    } catch (error) {
      console.error("❌ Store: Error deleting event coop:", error);
      throw error;
    }
  },
  //----------------------------------------------------------------

  //--------------------- Get Event Coops By Department -------------------------
  getEventCoopsByDepartment: async (departmentId: number) => {
    console.log("📥 Store: Getting event coops for department:", departmentId);
    set({ loading: true, error: null });
    try {
      const eventCoops = await eventCoopService.getEventCoopsByDepartment(departmentId);
      console.log("✅ Store: Event coops loaded:", eventCoops);
      set({ eventCoops: eventCoops, loading: false }); // ✅ อัปเดต state
      return eventCoops;
    } catch (error) {
      console.error("❌ Store: Error getting event coops by department:", error);
      set({ error: "Failed to fetch event coops by department", loading: false });
      throw error;
    }
  },
  //----------------------------------------------------------------
}));
