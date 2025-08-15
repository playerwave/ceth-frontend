// stores/Room/room.service.ts
import axiosInstance from "../../libs/axios";
import { Building, Faculty, Room } from "../../types/model";

// base path
const TEACHER_ROOM_PATH = "/teacher/room";

//--------------------- Fetch All Rooms -------------------------
export const fetchAllRooms = async (): Promise<Room[]> => {
  const response = await axiosInstance.get<Room[]>(
    `${TEACHER_ROOM_PATH}/get-rooms`
  );
  return response.data;
};
//----------------------------------------------------------------

//--------------------- Fetch Room by ID -------------------------
export const fetchRoomById = async (id: number): Promise<Room> => {
  const response = await axiosInstance.get<Room>(
    `${TEACHER_ROOM_PATH}/get-room/${id}`
  );
  return response.data;
};

//--------------------- Count Rooms ------------------------------
export const countRooms = async (): Promise<number> => {
  const response = await axiosInstance.get<{ count: number }>(
    `${TEACHER_ROOM_PATH}/count`
  );
  return response.data.count;
};
//----------------------------------------------------------------

//--------------------- Create Room ------------------------------
export const createRoom = async (payload: Partial<Room>): Promise<Room> => {
  console.log("📤 Creating room with payload:", payload);

  try {
    const response = await axiosInstance.post(
      `${TEACHER_ROOM_PATH}/create-room`,
      payload
    );

    // ✅ เพิ่ม delay เล็กน้อยเพื่อให้ Backend process เสร็จ
    await new Promise((resolve) => setTimeout(resolve, 100));

    return response.data;
  } catch (error) {
    console.error("❌ Error creating room:", error);
    throw error;
  }
};
//----------------------------------------------------------------

//--------------------- Update Room ------------------------------
export const updateRoom = async (room: Room): Promise<void> => {
  try {
    await axiosInstance.put(
      `${TEACHER_ROOM_PATH}/update-room/${room.room_id}`,
      {
        ...room,
        last_update: new Date(),
      }
    );

    // ✅ เพิ่ม delay เล็กน้อยเพื่อให้ Backend process เสร็จ
    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch (error) {
    console.error("❌ Error updating room:", error);
    throw error;
  }
};
//----------------------------------------------------------------

//--------------------- Delete Room ------------------------------
export const deleteRoom = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${TEACHER_ROOM_PATH}/delete-room/${id}`);

    // ✅ เพิ่ม delay เล็กน้อยเพื่อให้ Backend process เสร็จ
    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch (error) {
    console.error("❌ Error deleting room:", error);
    throw error;
  }
};
//----------------------------------------------------------------
// 🔧 Fetch all buildings
export const fetchAllBuildings = async (): Promise<Building[]> => {
  const res = await axiosInstance.get("/teacher/building/get-buildings");
  return res.data;
};

// 🔧 Fetch all faculties
export const fetchAllFaculties = async (): Promise<Faculty[]> => {
  const res = await axiosInstance.get("/faculty/get-faculties"); // ✅ แก้ให้ตรง
  return res.data.facultyData; // ✅ ถ้า backend ส่ง facultyData ภายใน object
};

// ✅ ฟังก์ชันตรวจสอบห้องที่ว่างในช่วงเวลาที่กำหนด
export const getAvailableRooms = async (
  start_activity_date: string,
  end_activity_date: string,
  exclude_activity_id?: number
): Promise<Room[]> => {
  const params = new URLSearchParams({
    start_activity_date,
    end_activity_date,
    ...(exclude_activity_id && {
      exclude_activity_id: exclude_activity_id.toString(),
    }),
  });

  const response = await axiosInstance.get<{ rooms: Room[]; count: number }>(
    `${TEACHER_ROOM_PATH}/available-rooms?${params}`
  );
  return response.data.rooms;
};

// ✅ ฟังก์ชันตรวจสอบห้องที่ถูกใช้งาน
export const getRoomConflicts = async (
  room_id: number,
  start_activity_date: string,
  end_activity_date: string,
  exclude_activity_id?: number
): Promise<any[]> => {
  const params = new URLSearchParams({
    start_activity_date,
    end_activity_date,
    ...(exclude_activity_id && {
      exclude_activity_id: exclude_activity_id.toString(),
    }),
  });

  const response = await axiosInstance.get<{
    conflicts: any[];
    has_conflicts: boolean;
  }>(`${TEACHER_ROOM_PATH}/room-conflicts/${room_id}?${params}`);
  return response.data.conflicts;
};

// ✅ ฟังก์ชันตรวจสอบห้องที่ว่างทั้งหมดในช่วงเวลาที่กำหนด
export const getAllAvailableRooms = async (
  start_activity_date: string,
  end_activity_date: string,
  exclude_activity_id?: number
): Promise<Room[]> => {
  const params = new URLSearchParams({
    start_activity_date,
    end_activity_date,
    ...(exclude_activity_id && {
      exclude_activity_id: exclude_activity_id.toString(),
    }),
  });

  const response = await axiosInstance.get<{ rooms: Room[]; count: number }>(
    `${TEACHER_ROOM_PATH}/all-available-rooms?${params}`
  );
  return response.data.rooms;
};

export const searchRooms = async (
  room_name?: string,
  building_name?: string,
  seat_number?: number
): Promise<Room[]> => {
  const params = new URLSearchParams();
  if (room_name) params.append("room_name", room_name);
  if (building_name) params.append("building_name", building_name);
  if (seat_number !== undefined)
    params.append("seat_number", seat_number.toString());

  const response = await axiosInstance.get<Room[]>(
    `/teacher/room/search-rooms?${params.toString()}`
  );
  return response.data;
};

//--------------------- Export Service ---------------------------
const roomService = {
  fetchAllRooms,
  countRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  fetchRoomById,
  fetchAllBuildings, // ✅ เพิ่มได้
  fetchAllFaculties, // ✅ เพิ่มได้
  getAvailableRooms, // ✅ เพิ่มฟังก์ชันใหม่
  getRoomConflicts, // ✅ เพิ่มฟังก์ชันใหม่
  getAllAvailableRooms, // ✅ เพิ่มฟังก์ชันใหม่
  searchRooms, // ✅ เพิ่มฟังก์ชันใหม่
};

export default roomService;
