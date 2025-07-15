// utils/activity.ts

import { Activity } from "../../../../../types/model";

// เปรียบเทียบคำค้นหา (ป้องกันค้นหาซ้ำคำเดิม)
export const isSameSearchTerm = (
  newTerm: string,
  currentTerm: string,
): boolean => {
  return newTerm.trim().toLowerCase() === currentTerm.trim().toLowerCase();
};

// กรองกิจกรรมตามสถานะ (Public หรือ Private)
export const filterActivitiesByStatus = (
  activities: Activity[],
  status: "Public" | "Private",
): Activity[] => {
  return activities.filter((a) => a.activity_status === status);
};

export const isActivityValid = (activity: Activity): boolean => {
  const {
    activity_name,
    presenter_company_name,
    description,
    type,
    event_format,
    seat,
    recieve_hours,
    activity_status,
    image_url,
    assessment_id,
    start_register_date,
    end_register_date,
    start_activity_date,
    end_activity_date,
    special_start_register_date,
    start_assessment,
    room_id,
  } = activity;

  // ถ้าเป็น Private ไม่ต้องตรวจสอบ
  if (activity_status === "Private") return true;

  // ชื่อกิจกรรม
  if (!activity_name || activity_name.length < 5 || activity_name.length > 50)
    return false;

  // ชื่อบริษัท/วิทยากร
  if (
    !presenter_company_name ||
    presenter_company_name.length < 5 ||
    presenter_company_name.length > 50
  )
    return false;

  // คำอธิบาย
  if (!description || description.length < 10 || description.length > 500)
    return false;

  // ประเภท
  if (!type) return false;

  // รูปภาพ
  if (!image_url || !/\.(jpg|jpeg|png)$/i.test(image_url)) return false;

  // ประเมินผล
  if (event_format !== "Course" && !assessment_id) return false;

  // ประเภทสถานที่
  if (!event_format) return false;

  // วันและเวลาเริ่ม-สิ้นสุดกิจกรรม
  if (!start_activity_date || !end_activity_date) return false;
  if (new Date(start_activity_date) >= new Date(end_activity_date))
    return false;

  // วันประเมินผล
  if (event_format !== "Course") {
    if (
      !start_assessment ||
      new Date(start_assessment) <= new Date(end_activity_date)
    )
      return false;
  }

  // วันลงทะเบียน
  if (event_format !== "Course") {
    if (!start_register_date || !end_register_date) return false;
    if (new Date(start_register_date) >= new Date(end_register_date))
      return false;
    if (new Date(end_register_date) >= new Date(start_activity_date))
      return false;
  }

  // วันเปิดลงทะเบียนเฉพาะกลุ่ม
  if (event_format === "Onsite") {
    if (
      !special_start_register_date ||
      new Date(special_start_register_date) >= new Date(start_register_date)
    )
      return false;
  }

  // ห้องและชั้น
  if (event_format === "Onsite") {
    if (!room_id || typeof room_id !== "number") return false;
  }

  // จำนวนที่นั่ง
  if (event_format !== "Course" && (seat === null || seat <= 0)) return false;

  // จำนวนชั่วโมง
  if (
    (event_format === "Course" &&
      (recieve_hours === null || recieve_hours <= 0)) ||
    ((event_format === "Online" || event_format === "Onsite") &&
      (recieve_hours === null || recieve_hours < 1))
  ) {
    return false;
  }

  return true;
};
