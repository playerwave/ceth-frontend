// src/mapper/eventCoopMapper.ts

import { ApiEventCoop } from "../api/eventCoop.api";
import { EventCoop } from "../../types/eventcoop.type";

/**
 * แปลง ApiEventCoop → EventCoop (ใช้ใน React & store)
 */
export function mapApiToEventCoop(a: ApiEventCoop): EventCoop {
  return {
    eventcoop_id: a.eventcoop_id,
    department_id: a.department_id,
    grade_id: a.grade_id,
    date: a.date ? new Date(a.date) : undefined,
    remaining_days: a.remaining_days,
    is_on_coop: a.is_on_coop,
  };
}

/**
 * แปลง Array<ApiEventCoop> → Array<EventCoop>
 */
export function mapApiToEventCoops(arr: ApiEventCoop[]): EventCoop[] {
  return arr.map(mapApiToEventCoop);
}
