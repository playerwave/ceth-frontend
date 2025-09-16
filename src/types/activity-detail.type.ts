export interface ActivityDetail {
  activity_detail_id: number;
  activity_id: number;
  activity_food_id?: number;
  register_date?: Date;
  time_in?: Date | null;
  time_out?: Date | null;
  status?: "Registered" | "Cancelled";
}
