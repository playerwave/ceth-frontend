// src/types/api/eventCoop.api.ts
/**
 * ปรับ interface ให้ตรงกับ shape ของ model.EventCoop
 */
export interface ApiEventCoop {
  eventcoop_id: number;
  department_id: number;
  grade_id: number;
  date?: string; // ISO string
  remaining_days?: number;
  is_on_coop?: boolean;
  department_name_tha?: string;
  grade_name?: string;
}
