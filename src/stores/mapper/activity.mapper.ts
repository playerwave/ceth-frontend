// src/mapper/activityMapper.ts

import { ApiActivity } from "../api/activity.api";
import { Activity, ActivityFood } from "../../types/model";

/**
 * แปลง ApiActivity → Activity (ใช้ใน React & store)
 */
export function mapApiToActivity(a: ApiActivity): Activity {
  return {
    activity_id: a.activity_id,
    activity_name: a.activity_name,
    presenter_company_name: a.presenter_company_name,
    type: a.type,
    description: a.description,
    seat: a.seat,
    recieve_hours: a.recieve_hours,
    event_format: a.event_format,
    create_activity_date: a.create_activity_date,
    special_start_register_date: a.special_start_register_date,
    start_register_date: a.start_register_date,
    end_register_date: a.end_register_date,
    start_activity_date: a.start_activity_date,
    end_activity_date: a.end_activity_date,
    image_url: a.image_url,
    activity_status: a.activity_status,
    activity_state: a.activity_state,
    status: a.status,
    last_update_activity_date: a.last_update_activity_date,
    url: a.url,
    assessment_id: a.assessment_id,
    room_id: a.room_id,
    start_assessment: a.start_assessment,
    end_assessment: a.end_assessment,
    // foods: a.foods ?? [],
    activityFood: a.activityFood ?? [],
  };
}

/**
 * แปลง Array<ApiActivity> → Array<Activity>
 */
export function mapApiToActivities(arr: ApiActivity[]): Activity[] {
  return arr.map(mapApiToActivity);
}

export function mapApiToEnrolledActivities(arr: ApiActivity[]): Activity[] {
  return arr.map(mapApiToActivity);
}
