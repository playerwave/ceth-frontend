// import { create } from "zustand";
// import { Room } from "../../types/model";
// import roomService from "../../service/Teacher/room.service";

// interface RoomStore {
//   rooms: Room[];
//   selectedRoom: Room | null;
//   room: Room | null;
//   loading: boolean;
//   error: string | null;
//   roomLoading: boolean;
//   roomError: string | null;

//   fetchRooms: () => Promise<void>;
//   fetchRoom: (id: number) => Promise<void>;
//   selectRoom: (id: number) => Promise<void>;
//   clearSelectedRoom: () => void;

//   createRoom: (roomData: Partial<Room>) => Promise<void>;
//   updateRoom: (room: Room) => Promise<void>;
//   deleteRoom: (id: number) => Promise<void>;

//   searchRooms?: (name: string) => Promise<void>;
//   searchResults?: Room[] | null;
// }

// export const useRoomStore = create<RoomStore>((set) => ({
//   rooms: [],
//   selectedRoom: null,
//   room: null,
//   loading: false,
//   error: null,
//   roomLoading: false,
//   roomError: null,
//   searchResults: null,

//   //------------------------------------------- Room Actions --------------------------------------------------

//   fetchRooms: async () => {
//     set({ loading: true, error: null });
//     try {
//       const data = await roomService.fetchAllRooms();
//       set({ rooms: data });
//     } catch (error) {
//       console.error("❌ Error fetching rooms:", error);
//       set({ error: "ไม่สามารถโหลดรายการห้องได้" });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   fetchRoom: async (id: number) => {
//     set({ roomLoading: true, roomError: null });
//     try {
//       const room = await roomService.getRoomById(id);
//       set({ room });
//     } catch (error) {
//       console.error("❌ Error fetching room:", error);
//       set({ roomError: "ไม่สามารถโหลดข้อมูลห้องนี้ได้" });
//     } finally {
//       set({ roomLoading: false });
//     }
//   },

//   selectRoom: async (id: number) => {
//     set({ loading: true });
//     try {
//       const room = await roomService.getRoomById(id);
//       set({ selectedRoom: room });
//     } catch (error) {
//       set({ error: "ไม่สามารถเลือกห้องได้" });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   clearSelectedRoom: () => set({ selectedRoom: null }),

//   createRoom: async (roomData) => {
//     set({ loading: true, error: null });
//     try {
//       await roomService.createRoom(roomData);
//       const updatedList = await roomService.fetchAllRooms();
//       set({ rooms: updatedList });
//     } catch (error) {
//       console.error("❌ Error creating room:", error);
//       set({ error: "ไม่สามารถสร้างห้องได้" });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   updateRoom: async (room) => {
//     try {
//       await roomService.updateRoom(room);
//       const updatedList = await roomService.fetchAllRooms();
//       set({ rooms: updatedList });
//     } catch (error) {
//       console.error("❌ Error updating room:", error);
//     }
//   },

//   deleteRoom: async (id) => {
//     try {
//       await roomService.deleteRoom(id);
//       const updatedList = await roomService.fetchAllRooms();
//       set({ rooms: updatedList });
//     } catch (error) {
//       console.error("❌ Error deleting room:", error);
//     }
//   },

//   searchRooms: async (name: string) => {
//     if (!name.trim()) {
//       await useRoomStore.getState().fetchRooms();
//       set({ searchResults: null });
//       return;
//     }

//     set({ roomLoading: true, roomError: null });
//     try {
//       const results = await roomService.searchRoomsByName(name);
//       set({ searchResults: results });
//     } catch (error) {
//       console.error("❌ Error searching rooms:", error);
//       set({ roomError: "ไม่สามารถค้นหาห้องได้" });
//     } finally {
//       set({ roomLoading: false });
//     }
//   },
// }));

import { create } from "zustand";
import { Room } from "../../types/model";
import roomService from "../../service/Teacher/room.service";

interface RoomStore {
  rooms: Room[];
  selectedRoom: Room | null;
  loading: boolean;
  error: string | null;

  fetchRooms: () => Promise<void>;
  selectRoom: (room: Room) => void;
  clearSelectedRoom: () => void;

  createRoom: (roomData: Partial<Room>) => Promise<void>;
  updateRoom: (room: Room) => Promise<void>;
  deleteRoom: (id: number) => Promise<void>;

  // Optional: countRooms
  roomCount?: number;
  fetchRoomCount?: () => Promise<void>;
}

export const useRoomStore = create<RoomStore>((set) => ({
  rooms: [],
  selectedRoom: null,
  loading: false,
  error: null,
  roomCount: undefined,

  //------------------------------------------- Room Actions --------------------------------------------------

  fetchRooms: async () => {
    set({ loading: true, error: null });
    try {
      const data = await roomService.fetchAllRooms();
      set({ rooms: data });
    } catch (error) {
      console.error("❌ Error fetching rooms:", error);
      set({ error: "ไม่สามารถโหลดรายการห้องได้" });
    } finally {
      set({ loading: false });
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
      const updatedList = await roomService.fetchAllRooms();
      set({ rooms: updatedList });
    } catch (error) {
      console.error("❌ Error creating room:", error);
      set({ error: "ไม่สามารถสร้างห้องได้" });
    } finally {
      set({ loading: false });
    }
  },

  updateRoom: async (room) => {
    try {
      await roomService.updateRoom(room);
      const updatedList = await roomService.fetchAllRooms();
      set({ rooms: updatedList });
    } catch (error) {
      console.error("❌ Error updating room:", error);
    }
  },

  deleteRoom: async (id) => {
    try {
      await roomService.deleteRoom(id);
      const updatedList = await roomService.fetchAllRooms();
      set({ rooms: updatedList });
    } catch (error) {
      console.error("❌ Error deleting room:", error);
    }
  },
}));
