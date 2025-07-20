// stores/Room/room.service.ts
import axiosInstance from "../../libs/axios";
import { Room } from "../../types/model";

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

  const response = await axiosInstance.post(
    `${TEACHER_ROOM_PATH}/create-room`,
    payload
  );
  return response.data;
};
//----------------------------------------------------------------

//--------------------- Update Room ------------------------------
export const updateRoom = async (room: Room): Promise<void> => {
  await axiosInstance.put(`${TEACHER_ROOM_PATH}/update-room/${room.room_id}`, {
    ...room,
    last_update: new Date(),
  });
};
//----------------------------------------------------------------

//--------------------- Delete Room ------------------------------
export const deleteRoom = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${TEACHER_ROOM_PATH}/delete-room/${id}`);
};
//----------------------------------------------------------------

//--------------------- Export Service ---------------------------
const roomService = {
  fetchAllRooms,
  countRooms,
  createRoom,
  updateRoom,
  deleteRoom,
};

export default roomService;
