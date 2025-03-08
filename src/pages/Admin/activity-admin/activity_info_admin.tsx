import { useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useActivityStore } from "../../../stores/Admin/activity_store";
import { Clock, MapPin, Play, User } from "lucide-react";

export default function ActivityInfoAdmin() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const id = location.state?.id || paramId; // ✅ ใช้ state หรือ param ถ้ามี
  const finalActivityId = id ? Number(id) : null;

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

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="mt-4 p-6 w-[1090px] h-auto border border-[#ddd] rounded-lg shadow-md bg-white mx-auto">
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
        <div className="flex justify-center w-full h-[300px] bg-white border border-black rounded-lg mt-4">
          <img
            src={activity.image_data} // ✅ ใช้ image_data ที่แปลงจาก Buffer เป็น Base64 แล้ว
            alt="Activity"
            className="w-[40%] h-full object-cover"
            onError={(e) => (e.currentTarget.src = "/img/default.png")} // ✅ ใช้ default image เมื่อโหลดไม่สำเร็จ
          />
        </div>

        {/* รายละเอียดกิจกรรม */}
        <div className="flex items-center justify-between w-full mt-4">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-[25px] font-sans">
              {activity.company_lecturer}
            </p>
            <span className="text-[12px] font-semibold bg-[#ceccfb] text-[#0e0cf4] px-2 py-1 w-[90px] text-center font-sans">
              {activity.type}
            </span>
          </div>
          <div className="flex items-center gap-1 font-[Sarabun]">
            <MapPin size={16} /> {activity.room}
          </div>
        </div>

        <p className="mt-2 text-[14px] font-sans">{activity.description}</p>

        {/* รายละเอียดอื่น ๆ */}
        <div className="mt-4">
          <p className="font-semibold font-[Sarabun]">อาหาร</p>
          <select className="w-[40%] p-2 border border-[#ccc] rounded mt-1">
            {Array.isArray(activity.ac_food) && activity.ac_food.length > 0 ? (
              activity.ac_food.map((food, index) => (
                <option key={index} className="font-[Sarabun]">
                  {food}
                </option>
              ))
            ) : (
              <option disabled>ไม่มีข้อมูล</option>
            )}
          </select>
        </div>

        {/* เวลา + สถานะ + ปุ่มต่าง ๆ */}
        <div className="flex justify-between items-center mt-4 text-[14px]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 font-[Sarabun] font-semibold">
              <Clock size={16} />
              {activity.start_time || "ไม่ระบุ"} -{" "}
              {activity.end_time || "ไม่ระบุ"}
            </div>

            <div className="flex items-center gap-1 ml-3 font-[Sarabun] font-semibold">
              <Play size={16} /> {activity.state}
            </div>
          </div>

          {/* ปุ่มต่าง ๆ */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 w-[100px] h-[30px] rounded-[20px] bg-[#1e3a8a] text-white font-bold text-[17px] font-[Sarabun] border-none"
            >
              ← กลับ
            </button>
            <button className="flex items-center justify-center w-[100px] h-[30px] rounded-[20px] bg-[#1e3a8a] text-white font-bold text-[17px] font-[Sarabun] border-none">
              QR Code
            </button>
            <button className="flex items-center justify-center w-[100px] h-[30px] rounded-[20px] bg-[#1e3a8a] text-white font-bold text-[17px] font-[Sarabun] border-none">
              แก้ไข
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
