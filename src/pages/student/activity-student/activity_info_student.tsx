import { useEffect, useCallback, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useActivityStore } from "../../../stores/Student/activity_student.store";
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
import { toast } from "sonner";

// import components
import Button from "../../../components/Button";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Loading from "../../../components/Loading";

export default function ActivityInfoStudent() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const id = location.state?.id || paramId; // ✅ ใช้ state หรือ param ถ้ามี
  const finalActivityId = id ? Number(id) : null;
  const navigate = useNavigate();

  const {
    activities,
    searchResults,
    fetchActivities,
    searchActivities,
    activityLoading,
    error,
    fetchActivity,
    enrollActivity,
    enrolledActivities,
    fetchEnrolledActivities,
    unenrollActivity,
  } = useActivityStore();

  const [isEnrolled, setIsEnrolled] = useState(false);

  // ✅ โหลดข้อมูลกิจกรรมที่ลงทะเบียนเมื่อหน้าโหลด
  useEffect(() => {
    const userId = 8;
    fetchEnrolledActivities(userId);
  }, []);

  // ✅ เช็คว่า user ลงทะเบียนกิจกรรมนี้หรือไม่ (หลังจากข้อมูลโหลดเสร็จ)
  useEffect(() => {
    console.log("📡 Fetching Activity Details...");
    fetchActivity(id);
  }, [fetchEnrolledActivities]); // ✅ ทำงานเมื่อ `fetchEnrolledActivities` เสร็จ

  useEffect(() => {
    if (enrolledActivities.length === 0) {
      console.log("⚠ ไม่มีข้อมูล enrolledActivities ยังไม่โหลด");
      return;
    }

    console.log("🔄 Checking if user is enrolled...");

    const isUserEnrolled = enrolledActivities.some(
      (act) => Number(act.ac_id) === Number(id) // ✅ แปลงเป็นตัวเลขก่อนเทียบ
    );

    setIsEnrolled((prev) => {
      if (prev !== isUserEnrolled) {
        console.log("✅ Updating isEnrolled to:", isUserEnrolled);
        return isUserEnrolled;
      }
      return prev; // ❌ ถ้าเท่าเดิม ไม่ต้อง setState ซ้ำ
    });
  }, [enrolledActivities, id]); // ✅ ทำงานเมื่อ enrolledActivities หรือ id เปลี่ยน

  console.log(id);

  console.log(enrolledActivities);

  console.log("✅ isEnrolled (client-side):", isEnrolled);

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isUnEnrollModalOpen, setIsUnEnrollModalOpen] = useState(false);

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

  if (activityLoading) return <Loading />;
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

  const handleEnroll = async () => {
    const userId = 8; // ดึง userId จาก localStorage
    if (!userId) {
      toast.error("❌ ไม่พบข้อมูลผู้ใช้");
      return;
    }

    await enrollActivity(userId, activity.id); // ✅ เรียกฟังก์ชันลงทะเบียน
    setIsEnrollModalOpen(false); // ปิด Modal
    navigate("/list-activity-student");
    window.location.reload();
  };

  const handleUnenroll = async () => {
    const userId = 8; // ดึงจาก localStorage แทนภายหลัง
    if (!userId) {
      toast.error("❌ ไม่พบข้อมูลผู้ใช้");
      return;
    }

    await unenrollActivity(userId, activity.id); // ✅ ฟังก์ชันนี้คุณต้องเพิ่มใน store ด้วย
    toast.success("✅ ยกเลิกการลงทะเบียนเรียบร้อย");
    navigate("/main-student");
    window.location.reload();
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

            <div className="text-green-600 text-2xl">
              +<span className="text-3xl">{activity.recieve_hours} Hrs</span>
            </div>
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
            <select className="w-[40%] p-2 border border-[#ccc] rounded mt-1">
              {activity.food.map((food, index) => (
                <option key={index} className="font-[Sarabun]">
                  {food}
                </option>
              ))}
            </select>
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
          {isEnrolled ? (
            <ConfirmDialog
              isOpen={isUnEnrollModalOpen}
              title="ยกเลิกการลงทะเบียนกิจกรรม"
              message={`คุณแน่ใจว่าจะยกเลิกการทะเบียนกิจกรรมนี้
                      (ลงทะเบียนกิจกรรมได้ถึง ${new Intl.DateTimeFormat(
                        "th-TH",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      ).format(activity.end_register)})`}
              onCancel={() => setIsUnEnrollModalOpen(false)}
              // ✅ ทำให้เป็นปุ่ม submit
              onConfirm={handleUnenroll}
            />
          ) : (
            <ConfirmDialog
              isOpen={isEnrollModalOpen}
              title="ยืนยันการลงทะเบียน"
              message={`คุณแน่ใจว่าจะลงทะเบียนกิจกรรมนี้
                      (ยกเลิกลงทะเบียนได้ถึง ${new Intl.DateTimeFormat(
                        "th-TH",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      ).format(activity.end_register)})`}
              onCancel={() => setIsEnrollModalOpen(false)}
              // ✅ ทำให้เป็นปุ่ม submit
              onConfirm={handleEnroll}
            />
          )}

          {/* ปุ่มต่าง ๆ */}
          <div className="flex justify-end gap-3">
            <Button color="blue" onClick={() => window.history.back()}>
              ← กลับ
            </Button>

            {isEnrolled ? (
              <Button color="red" onClick={() => setIsUnEnrollModalOpen(true)}>
                ยกเลิกลงทะเบียน
              </Button>
            ) : (
              <Button color="blue" onClick={() => setIsEnrollModalOpen(true)}>
                ลงทะเบียน
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageActivityStudent;
