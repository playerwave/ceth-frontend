import axiosInstance from "../../libs/axios";
import { ApiActivity } from "../../types/Admin/activity_list_type";
import { Activity } from "../../types/Student/activity_list_studen_type";

// แปลงข้อมูล API ดิบเป็น Activity ที่ store ต้องการ
export const mapActivityData = (apiData: ApiActivity): Activity => ({
  id: apiData.ac_id.toString(),
  name: apiData.ac_name || "ไม่ระบุชื่อ",
  company_lecturer: apiData.ac_company_lecturer || "ไม่ระบุวิทยากร",
  description: apiData.ac_description || "ไม่ระบุรายละเอียด",
  type: apiData.ac_type === "Hard Skill" ? "Hard Skill" : "Soft Skill",
  room: apiData.ac_room || "ไม่ระบุห้อง",
  seat: `${apiData.ac_seat}`,
  food: Array.isArray(apiData.ac_food) ? apiData.ac_food : [],
  status: apiData.ac_status.toLowerCase() === "public" ? "Public" : "Private",
  location_type: apiData.ac_location_type,
  start_register: apiData.ac_start_register
    ? new Date(apiData.ac_start_register)
    : null,
  end_register: apiData.ac_end_register
    ? new Date(apiData.ac_end_register)
    : null,
  create_date: apiData.ac_create_date ? new Date(apiData.ac_create_date) : null,
  last_update: apiData.ac_last_update ? new Date(apiData.ac_last_update) : null,
  start_time: apiData.ac_start_time ? new Date(apiData.ac_start_time) : null,
  end_time: apiData.ac_end_time ? new Date(apiData.ac_end_time) : null,
  registered_count: apiData.ac_registered_count ?? 0,
  attended_count: apiData.ac_attended_count ?? 0,
  not_attended_count: apiData.ac_not_attended_count ?? 0,
  image_url: apiData.ac_image_url || "/img/default.png",
  state: apiData.ac_state || "ไม่ระบุ",
  normal_register: apiData.ac_normal_register
    ? new Date(apiData.ac_normal_register)
    : null,
  recieve_hours: apiData.ac_recieve_hours || 0,
  start_assessment: apiData.ac_start_assessment
    ? new Date(apiData.ac_start_assessment)
    : null,
  end_assessment: apiData.ac_end_assessment
    ? new Date(apiData.ac_end_assessment)
    : null,
  assessment: apiData.assessment
    ? {
        as_id: apiData.assessment.as_id,
        as_name: apiData.assessment.as_name,
        as_type: apiData.assessment.as_type,
        as_description: apiData.assessment.as_description,
        as_create_date: apiData.assessment.as_create_date,
        as_last_update: apiData.assessment.as_last_update,
      }
    : null,
  uac_selected_food: apiData.uac_selected_food,
});

// ฟังก์ชันที่จัดการการดึงข้อมูลกิจกรรมทั้งหมด
export const fetchActivities = async () => {
  const response = await axiosInstance.get("/admin/activity/get-activities");
  return response.data.map((a: ApiActivity) => mapActivityData(a));
};

// ฟังก์ชันที่ค้นหากิจกรรมตามชื่อ
export const searchActivities = async (searchName: string) => {
  const { data } = await axiosInstance.get("/admin/activity/searchActivity", {
    params: { ac_name: searchName.trim() },
  });
  return data.map((a: ApiActivity) => mapActivityData(a));
};

// ฟังก์ชันที่โหลดกิจกรรมเฉพาะรายการ
export const fetchActivity = async (
  id: string | number,
  userId: string | number
) => {
  const { data } = await axiosInstance.get(
    `//admin/activity/get-activity/${id}?userId=${userId}`
  );
  return mapActivityData(data);
};
