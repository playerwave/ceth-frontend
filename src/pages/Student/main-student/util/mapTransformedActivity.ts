// export const mapTransformedActivity = (activity: any) => {
//   console.log("🧱 mapping activity:", activity);

//   if (!activity.ac_id) {
//     console.warn("⚠️ กิจกรรมนี้ไม่มี ac_id:", activity);
//     return null;
//   }

//   return {
//     id: activity.ac_id,
//     name: activity.ac_name,
//     company_lecturer: activity.ac_company_lecturer,
//     type: activity.ac_type,
//     start_time: activity.ac_start_time,
//     end_time: activity.ac_end_time,
//     registered_count: activity.ac_registered_count,
//     not_attended_count: activity.ac_not_attended_count,
//     location_type: activity.ac_location_type,
//   };
// };

export const mapTransformedActivity = (activity: any) => ({
  id: activity.ac_id,
  name: activity.ac_name,
  company_lecturer: activity.ac_company_lecturer,
  type: activity.ac_type,
  start_time: activity.ac_start_time,
  end_time: activity.ac_end_time,
  location_type: activity.ac_location_type,
  registered_count: activity.ac_registered_count,
  not_attended_count: activity.ac_not_attended_count,
  seat: activity.ac_seat,
  start_assessment: activity.ac_start_assessment,
  end_assessment: activity.ac_end_assessment,

});




