export interface Room {
  room_id: number;
  faculty_id: number;
  building_id?: number;
  room_name?: string;
  floor?: string;
  seat_number?: number;
  status?: "Active" | "Available";
}
