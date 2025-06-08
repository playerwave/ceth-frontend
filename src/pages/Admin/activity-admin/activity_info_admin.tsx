import { useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useActivityStore } from "../../../stores/Admin/activity_store";
import {
  Clock,
  MapPin,
  Play,
  User,
  CalendarDays,
  Hourglass,
  Frown,
  School,
  HouseWifi,
} from "lucide-react";
import Typography from "@mui/material/Typography";
import Button from "../../../components/Button";
import { Select, MenuItem } from "@mui/material";

export default function ActivityInfoAdmin() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const id = location.state?.id || paramId; // ✅ ใช้ state หรือ param ถ้ามี
  const finalActivityId = id ? Number(id) : null;

  const { activity, isLoading, error, fetchActivity } = useActivityStore();

  const finalActivityId = id ? Number(id) : null;
  const navigate = useNavigate();

  const { activity, isLoading, error, fetchActivity } = useActivityStore();

  const fetchActivityData = useCallback(() => {
    if (finalActivityId !== null && !isNaN(finalActivityId)) {
      console.log("📡 Fetching Activity with ID:", finalActivityId);
      fetchActivity(finalActivityId);
    } else {
      console.error("❌ Error: Activity ID is missing or invalid!");
    }
  }, [finalActivityId, fetchActivity]);

  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData]);

  console.log("📌 Activity from Store:", activity);

  if (isLoading) return <p className="text-center text-lg">⏳ กำลังโหลด...</p>;
  if (error)
    return <p className="text-center text-lg text-red-500">❌ {error}</p>;
  if (!activity) return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // แปลง 0 เป็น 12
    minutes = minutes.toString().padStart(2, "0"); // เติม 0 ข้างหน้า ถ้าจำนวนน้อยกว่า 10
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="justify-items-center">
      <div className="w-320 h-230 mx-auto ml-2xl mt-5 mb-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-[35px] font-semibold font-sans">
            {activity.name}
          </h1>
          <div
            className="flex items-center text-[25px] gap-[4px] cursor-pointer"
            onClick={() => navigate(`/enrolled_list_admin/${activity.id}`)}
          >
            {activity.registered_count}/{activity.seat} <User size={40} />
          </div>
        </div>

        {/* ภาพกิจกรรม */}
        <div className="flex justify-center w-full h-130 bg-white border border-black rounded-lg mt-4">
          <img
            src={activity.image_url || "/img/default.png"} // ✅ ใช้รูป Cloudinary หรือ default
            alt="Activity"
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => (e.currentTarget.src = "/img/default.png")} // ✅ ใช้ default image ถ้าโหลดไม่สำเร็จ
          />
        </div>

        {/* รายละเอียดกิจกรรม */}
        <div className="flex items-center justify-between w-full mt-4">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-[25px] font-sans">
              {activity.company_lecturer}
            </p>
            <span
              className="px-2 py-1 rounded ml-5"
              style={{
                backgroundColor:
                  activity.type === "Hard Skill"
                    ? "rgba(255, 174, 0, 0.2)"
                    : "rgba(9, 0, 255, 0.2)",
                color: activity.type === "Hard Skill" ? "#FFAE00" : "#0900FF",
                minWidth: "100px",
                display: "flex", // ✅ ใช้ flexbox
                justifyContent: "center", // ✅ จัดให้อยู่กึ่งกลางแนวนอน
                alignItems: "center",
              }}
            >
              {activity.type}
            </span>
          </div>
          <div className="flex items-center gap-1 font-[Sarabun]">
            {activity.location_type == "Onsite" ? (
              <Typography
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  pr: 4,
                }}
              >
                <School /> Onsite
              </Typography>
            ) : (
              <Typography
                component="span"
                sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
              >
                <HouseWifi /> {activity.location_type}
              </Typography>
            )}
            <CalendarDays size={25} />
            วันที่จัดกิจกรรม{" "}
            {activity.start_time
              ? new Date(activity.start_time).getDate() + 1 < 10
                ? `0${new Date(activity.start_time).getDate() + 1}`
                : new Date(activity.start_time).getDate()
              : "ไม่ระบุ"}{" "}
            /
            {activity.start_time
              ? new Date(activity.start_time).getMonth() + 1 < 10
                ? `0${new Date(activity.start_time).getMonth() + 1}`
                : new Date(activity.start_time).getMonth() // ✅ แก้ไขตรงนี้
              : "ไม่ระบุ"}{" "}
            /
            {activity.start_time
              ? new Date(activity.start_time).getFullYear()
              : "ไม่ระบุ"}{" "}
            <Hourglass size={25} /> ปิดลงทะเบียน{" "}
            {activity.end_register
              ? new Date(activity.end_register).getDate() + 1 < 10
                ? `0${new Date(activity.end_register).getDate() + 1}`
                : new Date(activity.end_register).getDate() // ✅ แก้ไขตรงนี้
              : "ไม่ระบุ"}{" "}
            /
            {activity.end_register
              ? new Date(activity.end_register).getMonth() + 1 < 10
                ? `0${new Date(activity.end_register).getMonth() + 1}`
                : new Date(activity.end_register).getMonth() // ✅ แก้ไขตรงนี้
              : "ไม่ระบุ"}{" "}
            /
            {activity.end_register
              ? new Date(activity.end_register).getFullYear()
              : "ไม่ระบุ"}{" "}
            <MapPin size={25} /> ชั้น {activity.room[0]} ห้อง {activity.room}
          </div>
        </div>

        <p className="mt-2 text-[14px] font-sans">{activity.description}</p>

        {/*เลือก อาหาร*/}
        <div className="mt-4">
          <p className="font-semibold font-[Sarabun]">อาหาร</p>
          {Array.isArray(activity.food) && activity.food.length > 0 ? (
            <Select
              className="w-[40%] mt-1"
              value={activity.food[0] || ""} // ค่าเริ่มต้นเป็นตัวแรกในรายการ หรือเป็น "" ถ้าไม่มีค่า
              onChange={(e) => console.log("เลือก:", e.target.value)} // สามารถเปลี่ยนเป็นฟังก์ชันที่ต้องการ
              displayEmpty
            >
              {activity.food.map((food, index) => (
                <MenuItem key={index} value={food}>
                  {food}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <p className="text-gray-500 mt-1 flex items-center">
              ไม่มีอาหารสำหรับกิจกรรมนี้ <Frown className="ml-3" />
            </p>
          )}
        </div>

        {/* เวลา + สถานะ + ปุ่มต่าง ๆ */}
        <div className="flex justify-between items-center mt-4 text-[14px]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 font-[Sarabun] font-semibold">
              <Clock size={25} />
              {activity.start_time
                ? formatTime(new Date(activity.start_time))
                : "ไม่ระบุ"}{" "}
              -{" "}
              {activity.end_time
                ? formatTime(new Date(activity.end_time))
                : "ไม่ระบุ"}
            </div>

            <div className="flex items-center gap-1 ml-3 font-[Sarabun] font-semibold">
              <Play size={25} /> {activity.state}
            </div>
          </div>

          {/* ปุ่มต่าง ๆ */}
          <div className="flex justify-end gap-3">
            <Button color="blue" onClick={() => window.history.back()}>
              ← กลับ
            </Button>
            <Button color="blue">QR Code</Button>
            <Button
              color="blue"
              onClick={() => handleToUpdateActivity(activity.id)}
            >
              แก้ไข
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

