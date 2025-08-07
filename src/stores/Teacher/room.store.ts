import { create } from "zustand";
import { Building, Faculty, Room } from "../../types/model";
import roomService from "../../service/Teacher/room.service";

interface RoomStore {
  rooms: Room[];
  selectedRoom: Room | null;
  loading: boolean;
  error: string | null;
  buildings: Building[];
  faculties: Faculty[];
  availableRooms: Room[];
  roomConflicts: any[];
  checkingAvailability: boolean;

  // ✅ เพิ่ม cache state
  lastFetched: number | null;
  cacheExpiry: number; // 5 minutes
  isInitialized: boolean;

  fetchRooms: () => Promise<void>;
  selectRoom: (room: Room) => void;
  clearSelectedRoom: () => void;

  createRoom: (roomData: Partial<Room>) => Promise<void>;
  updateRoom: (room: Room) => Promise<void>;
  deleteRoom: (id: number) => Promise<void>;

  checkAvailableRooms: (
    start_date: string,
    end_date: string,
    exclude_id?: number
  ) => Promise<void>;
  checkRoomConflicts: (
    room_id: number,
    start_date: string,
    end_date: string,
    exclude_id?: number
  ) => Promise<void>;
  checkAllAvailableRooms: (
    start_date: string,
    end_date: string,
    exclude_id?: number
  ) => Promise<void>;
  clearAvailabilityCheck: () => void;

  roomCount?: number;
  fetchRoomCount?: () => Promise<void>;
  fetchBuildings: () => Promise<void>;
  fetchFaculties: () => Promise<void>;

  // ✅ เพิ่มฟังก์ชันใหม่
  initializeData: () => Promise<void>;
  refreshData: () => Promise<void>;
  invalidateCache: () => void;
  isCacheValid: () => boolean;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  selectedRoom: null,
  loading: false,
  error: null,
  roomCount: undefined,
  buildings: [],
  faculties: [],
  availableRooms: [],
  roomConflicts: [],
  checkingAvailability: false,

  // ✅ cache state
  lastFetched: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes
  isInitialized: false,

  // ✅ ตรวจสอบ cache validity
  isCacheValid: () => {
    const { lastFetched, cacheExpiry } = get();
    return !!(lastFetched && Date.now() - lastFetched < cacheExpiry);
  },

  // ✅ invalidate cache
  invalidateCache: () => {
    set({ lastFetched: null, isInitialized: false });
  },

  // ✅ โหลดข้อมูลทั้งหมดพร้อมกัน
  initializeData: async () => {
    const { isInitialized, isCacheValid } = get();

    // ถ้าเคยโหลดแล้วและ cache ยังไม่หมดอายุ ให้ข้าม
    if (isInitialized && isCacheValid()) {
      return;
    }

    set({ loading: true, error: null });

    try {
      // ✅ โหลดข้อมูลแบบ parallel
      const [roomsData, buildingsData, facultiesData] = await Promise.all([
        roomService.fetchAllRooms(),
        roomService.fetchAllBuildings(),
        roomService.fetchAllFaculties(),
      ]);

      set({
        rooms: roomsData,
        buildings: buildingsData,
        faculties: facultiesData,
        lastFetched: Date.now(),
        isInitialized: true,
        loading: false,
      });
    } catch (error) {
      console.error("❌ Error initializing data:", error);
      set({
        error: "ไม่สามารถโหลดข้อมูลได้",
        loading: false,
      });
    }
  },

  // ✅ refresh ข้อมูลทั้งหมด
  refreshData: async () => {
    set({ loading: true, error: null });

    try {
      const [roomsData, buildingsData, facultiesData] = await Promise.all([
        roomService.fetchAllRooms(),
        roomService.fetchAllBuildings(),
        roomService.fetchAllFaculties(),
      ]);

      set({
        rooms: roomsData,
        buildings: buildingsData,
        faculties: facultiesData,
        lastFetched: Date.now(),
        loading: false,
      });
    } catch (error) {
      console.error("❌ Error refreshing data:", error);
      set({
        error: "ไม่สามารถรีเฟรชข้อมูลได้",
        loading: false,
      });
    }
  },

  fetchFaculties: async () => {
    try {
      const data = await roomService.fetchAllFaculties();
      set({ faculties: data });
    } catch (error) {
      console.error("❌ Error fetching faculties:", error);
      set({ error: "โหลดข้อมูลคณะไม่สำเร็จ" });
    }
  },

  fetchRooms: async () => {
    // ✅ ใช้ cache ถ้ามี
    if (get().isCacheValid()) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await roomService.fetchAllRooms();
      set({
        rooms: data,
        lastFetched: Date.now(),
        loading: false,
      });
    } catch (error) {
      console.error("❌ Error fetching rooms:", error);
      set({ error: "ไม่สามารถโหลดรายการห้องได้", loading: false });
    }
  },

  fetchRoomCount: async () => {
    try {
      const count = await roomService.countRooms();
      set({ roomCount: count });
    } catch (error) {
      console.error("❌ Error fetching room count:", error);
    }
  },

  selectRoom: (room: Room) => {
    set({ selectedRoom: room });
  },

  clearSelectedRoom: () => set({ selectedRoom: null }),

  createRoom: async (roomData) => {
    set({ loading: true, error: null });
    try {
      await roomService.createRoom(roomData);
      // ✅ invalidate cache และ refresh ข้อมูลหลังจากสร้าง
      get().invalidateCache();
      await get().refreshData();
    } catch (error) {
      console.error("❌ Error creating room:", error);
      set({ error: "ไม่สามารถสร้างห้องได้", loading: false });
    }
  },

  updateRoom: async (room) => {
    set({ loading: true, error: null });
    try {
      await roomService.updateRoom(room);
      // ✅ invalidate cache และ refresh ข้อมูลหลังจากอัปเดต
      get().invalidateCache();
      await get().refreshData();
    } catch (error) {
      console.error("❌ Error updating room:", error);
      set({ error: "ไม่สามารถอัปเดตห้องได้", loading: false });
    }
  },

  deleteRoom: async (id) => {
    set({ loading: true, error: null });
    try {
      await roomService.deleteRoom(id);
      // ✅ invalidate cache และ refresh ข้อมูลหลังจากลบ
      get().invalidateCache();
      await get().refreshData();
    } catch (error) {
      console.error("❌ Error deleting room:", error);
      set({ error: "ไม่สามารถลบห้องได้", loading: false });
    }
  },

  fetchBuildings: async () => {
    try {
      const data = await roomService.fetchAllBuildings();
      set({ buildings: data });
    } catch (error) {
      console.error("❌ Error fetching buildings:", error);
    }
  },

  checkAvailableRooms: async (
    start_date: string,
    end_date: string,
    exclude_id?: number
  ) => {
    set({ checkingAvailability: true, error: null });
    try {
      const availableRooms = await roomService.getAvailableRooms(
        start_date,
        end_date,
        exclude_id
      );
      set({ availableRooms, checkingAvailability: false });
    } catch (error) {
      console.error("❌ Error checking available rooms:", error);
      set({
        error: "ไม่สามารถตรวจสอบห้องที่ว่างได้",
        checkingAvailability: false,
      });
    }
  },

  checkRoomConflicts: async (
    room_id: number,
    start_date: string,
    end_date: string,
    exclude_id?: number
  ) => {
    set({ checkingAvailability: true, error: null });
    try {
      const conflicts = await roomService.getRoomConflicts(
        room_id,
        start_date,
        end_date,
        exclude_id
      );
      set({ roomConflicts: conflicts, checkingAvailability: false });
    } catch (error) {
      console.error("❌ Error checking room conflicts:", error);
      set({
        error: "ไม่สามารถตรวจสอบห้องที่ถูกใช้งานได้",
        checkingAvailability: false,
      });
    }
  },

  checkAllAvailableRooms: async (
    start_date: string,
    end_date: string,
    exclude_id?: number
  ) => {
    set({ checkingAvailability: true, error: null });
    try {
      const availableRooms = await roomService.getAllAvailableRooms(
        start_date,
        end_date,
        exclude_id
      );
      set({ availableRooms, checkingAvailability: false });
    } catch (error) {
      console.error("❌ Error checking all available rooms:", error);
      set({
        error: "ไม่สามารถตรวจสอบห้องที่ว่างได้",
        checkingAvailability: false,
      });
    }
  },

  clearAvailabilityCheck: () => {
    set({ availableRooms: [], roomConflicts: [], checkingAvailability: false });
  },
}));
