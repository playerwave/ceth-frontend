// utils/activity.ts

import { Activity } from "../../../../../types/model";

// เปรียบเทียบคำค้นหา (ป้องกันค้นหาซ้ำคำเดิม)
export const isSameSearchTerm = (
  newTerm: string,
  currentTerm: string
): boolean => {
  return newTerm.trim().toLowerCase() === currentTerm.trim().toLowerCase();
};

// กรองกิจกรรมตามสถานะ (Public หรือ Private)
export const filterActivitiesByStatus = (
  activities: Activity[],
  status: "Public" | "Private"
): Activity[] => {
  return activities.filter((a) => a.activity_status === status);
};

export const isActivityValid = (activity: Activity): boolean => {
  const { activity_status, activity_state } = activity;

  // ถ้าเป็น Private ไม่ต้องตรวจสอบ
  if (activity_status === "Private") return true;

  // ✅ เงื่อนไขเดียว: เช็คว่า activity_state เป็น "Not Start" หรือไม่
  const isNotStarted = activity_state === "Not Start";

  // 🔍 Debug: แสดงข้อมูลที่ตรวจสอบ
  console.log("🔍 Activity Validation Check:", {
    activity_id: activity.activity_id,
    activity_name: activity.activity_name,
    activity_status,
    activity_state,
    isNotStarted,
    canChangeToPrivate: isNotStarted,
  });

  // ถ้าเป็น "Not Start" ให้เปลี่ยนได้เลย
  if (isNotStarted) {
    console.log(
      "✅ Activity validation PASSED - Not Start state:",
      activity.activity_name
    );
    return true;
  }

  // ถ้าไม่ใช่ "Not Start" ไม่ให้เปลี่ยน
  console.log("❌ Activity validation FAILED - Not Not Start state:", {
    activity_name: activity.activity_name,
    activity_state,
  });
  return false;
};

// ตรวจสอบเงื่อนไขการเปลี่ยนจาก Private เป็น Public
export const validatePrivateToPublic = (
  activity: Activity
): {
  isValid: boolean;
  reason: "complete" | "date_conflict" | "valid" | null;
  message: string;
} => {
  const {
    activity_name,
    presenter_company_name,
    description,
    type,
    event_format,
    seat,
    recieve_hours,
    activity_state,
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

  // 🔍 Debug: แสดงข้อมูลที่ตรวจสอบ
  console.log("🔍 Private to Public Validation Check:", {
    activity_id: activity.activity_id,
    activity_name,
    presenter_company_name,
    description: description?.length,
    type,
    event_format,
    seat,
    recieve_hours,
    activity_state,
    image_url: image_url ? "Has image" : "No image",
    assessment_id,
    start_register_date,
    end_register_date,
    start_activity_date,
    end_activity_date,
    special_start_register_date,
    start_assessment,
    room_id,
  });

  // ตรวจสอบข้อมูลครบถ้วน
  const hasCompleteData =
    activity_name &&
    activity_name.length >= 5 &&
    activity_name.length <= 50 &&
    presenter_company_name &&
    presenter_company_name.length >= 5 &&
    presenter_company_name.length <= 50 &&
    description &&
    description.length >= 10 &&
    description.length <= 500 &&
    type &&
    event_format;

  if (!hasCompleteData) {
    console.log("❌ Incomplete data validation failed");
    return {
      isValid: false,
      reason: "complete",
      message: "กรุณาใส่ข้อมูลของกิจกรรมให้ครบ",
    };
  }

  // ตรวจสอบเงื่อนไขวันที่
  const now = new Date();

  // ตรวจสอบวันที่ลงทะเบียน
  if (start_register_date && end_register_date) {
    const startRegisterDate = new Date(start_register_date);
    const endRegisterDate = new Date(end_register_date);

    // ถ้าวันที่เปิดลงทะเบียนอยู่ก่อนวันปัจจุบัน
    if (endRegisterDate < now) {
      console.log(
        "❌ Date conflict validation failed - registration date in past"
      );
      return {
        isValid: false,
        reason: "date_conflict",
        message: "กรุณากรอกข้อมูลกิจกรรมให้ตรงเงื่อนไข",
      };
    }
  }

  // ตรวจสอบวันที่กิจกรรม
  if (start_activity_date && end_activity_date) {
    const startActivityDate = new Date(start_activity_date);
    const endActivityDate = new Date(end_activity_date);

    // ถ้าวันที่กิจกรรมอยู่ก่อนวันปัจจุบัน
    if (endActivityDate < now) {
      console.log("❌ Date conflict validation failed - activity date in past");
      return {
        isValid: false,
        reason: "date_conflict",
        message: "กรุณากรอกข้อมูลกิจกรรมให้ตรงเงื่อนไข",
      };
    }
  }

  // ตรวจสอบเงื่อนไขอื่นๆ ตาม event_format
  if (event_format === "Onsite") {
    // ตรวจสอบห้อง
    if (!room_id) {
      console.log("❌ Room validation failed for Onsite event");
      return {
        isValid: false,
        reason: "complete",
        message: "กรุณาใส่ข้อมูลของกิจกรรมให้ครบ",
      };
    }
  }

  // ตรวจสอบรูปภาพ
  if (
    !image_url ||
    typeof image_url !== "string" ||
    !/\.(jpg|jpeg|png)$/i.test(image_url)
  ) {
    console.log("❌ Image validation failed");
    return {
      isValid: false,
      reason: "complete",
      message: "กรุณาใส่ข้อมูลของกิจกรรมให้ครบ",
    };
  }

  // ตรวจสอบจำนวนที่นั่ง/ชั่วโมง
  if (event_format !== "Course") {
    if (!seat || seat <= 0) {
      console.log("❌ Seat validation failed");
      return {
        isValid: false,
        reason: "complete",
        message: "กรุณาใส่ข้อมูลของกิจกรรมให้ครบ",
      };
    }
  }

  if (event_format === "Course") {
    if (!recieve_hours || recieve_hours <= 0) {
      console.log("❌ Receive hours validation failed for Course");
      return {
        isValid: false,
        reason: "complete",
        message: "กรุณาใส่ข้อมูลของกิจกรรมให้ครบ",
      };
    }
  } else {
    if (!recieve_hours || recieve_hours < 1) {
      console.log("❌ Receive hours validation failed");
      return {
        isValid: false,
        reason: "complete",
        message: "กรุณาใส่ข้อมูลของกิจกรรมให้ครบ",
      };
    }
  }

  console.log(
    "✅ Private to Public validation PASSED:",
    activity.activity_name
  );
  return {
    isValid: true,
    reason: "valid",
    message: "คุณแน่ใจใช่ไหมที่ Public กิจกรรมนี้นิสิตทุกคนจะเห็นกิจกรรมนี้",
  };
};
