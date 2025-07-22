// src/service/Visitor/activity.service.visitor.ts

import axiosInstance from "../../libs/axios";
import { ParsedVisitorActivity } from "../../types/Visitor/parsed_visitor_activity";
import { Activity } from "../../types/model"; // นำเข้า Activity Type ของคุณ

const API_URL_FOR_VISITOR = "http://localhost:5090/visitor";

const convertParsedToActivity = (
  parsedActivity: ParsedVisitorActivity
): Activity => {
  return {
    activity_id: parseInt(parsedActivity.activity_id),
    activity_name: parsedActivity.activity_name,
    presenter_company_name: parsedActivity.organizer, // ใช้ organizer
    type: "Soft", // ต้องกำหนด Logic การแปลง type ถ้ามีข้อมูลใน API. ถ้าไม่มีข้อมูล type ใน parsedActivity, ต้องตัดสินใจค่าเริ่มต้น
    description: parsedActivity.description,
    seat: parsedActivity.max_participants, // ใช้ max_participants
    recieve_hours: 0, // กำหนดค่าเริ่มต้น
    event_format: parsedActivity.location_type as
      | "Online"
      | "Onsite"
      | "Course",
    create_activity_date: "", // กำหนดค่าเริ่มต้น
    special_start_register_date: "", // กำหนดค่าเริ่มต้น
    start_register_date: parsedActivity.start_date, // ใช้ start_date
    end_register_date: parsedActivity.end_date, // ใช้ end_date
    start_activity_date: parsedActivity.start_date, // ใช้ start_date
    end_activity_date: parsedActivity.end_date, // ใช้ end_date
    image_url: "", // กำหนดค่าเริ่มต้น
    activity_status:
      parsedActivity.activity_status === "Open Register" ? "Public" : "Private", // แปลงให้ตรงกับ Activity
    activity_state: "Open Register", // กำหนดค่าเริ่มต้น
    status: "Active", // กำหนดค่าเริ่มต้น
    last_update_activity_date: "", // กำหนดค่าเริ่มต้น
    url: null, // กำหนดค่าเริ่มต้น
    assessment_id: 0, // กำหนดค่าเริ่มต้น
    room_id: 0, // กำหนดค่าเริ่มต้น
    start_assessment: null, // กำหนดค่าเริ่มต้น
    end_assessment: null, // กำหนดค่าเริ่มต้น
    foods: [], // กำหนดค่าเริ่มต้น
  };
};

const fetchPublicActivities = async (): Promise<Activity[]> => {
  // คืนค่าเป็น Activity[]
  try {
    const response =
      await axiosInstance.get<{ row: string }[]>(API_URL_FOR_VISITOR);

    const rawData: { row: string }[] = response.data;

    if (!rawData || rawData.length === 0) {
      console.warn("API returned no data or empty array.");
      return [];
    }

    const parsedActivities: ParsedVisitorActivity[] = rawData.map((item) => {
      // ... (โค้ด parsing เดิมเหมือนที่คุณเคยมี)
      const cleanedString = item.row
        .substring(1, item.row.length - 1)
        .replace(/\\"/g, '"');
      const parts = cleanedString.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const cleanPart = (part: string) => part.trim().replace(/^"|"$/g, "");

      return {
        activity_id: cleanPart(parts[0]),
        activity_name: cleanPart(parts[1]),
        organizer: cleanPart(parts[2]),
        department: cleanPart(parts[3]),
        description: cleanPart(parts[4]),
        max_participants: parseInt(cleanPart(parts[5]) || "0"),
        location_type: cleanPart(parts[7]),
        start_date: cleanPart(parts[8]),
        end_date: cleanPart(parts[9]),
        activity_status: cleanPart(parts[12]),
        activity_code: cleanPart(parts[13]),
        // ถ้า parts[6] คือ type (Soft/Hard) คุณสามารถเพิ่มตรงนี้ได้:
        // type: cleanPart(parts[6]) as "Soft" | "Hard",
      } as ParsedVisitorActivity;
    });

    const activities: Activity[] = parsedActivities.map(
      convertParsedToActivity
    );

    console.log("Converted Activities for Table:", activities);
    return activities;
  } catch (error) {
    console.error("Error fetching and parsing public activities:", error);
    throw new Error("Failed to fetch and process public activities data.");
  }
};

export const activityService = {
  fetchPublicActivities,
};
