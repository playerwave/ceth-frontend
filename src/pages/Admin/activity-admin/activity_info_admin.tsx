import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActivityStore } from "../../../stores/activity_store";
import BackBotton from "../../../components/botton/back_botton";
import { Clock, MapPin, Play, User } from "lucide-react";

export default function ActivityInfoAdmin() {
  const { id } = useParams<{ id: string }>(); // ✅ useParams รับค่า id จาก URL
  const navigate = useNavigate();
  const { activity, isLoading, error, fetchActivity} = useActivityStore();

  const finalActivityId = id ? Number(id) : null;

  useEffect(() => {
    if (finalActivityId !== null && !isNaN(finalActivityId)) {
      console.log("📡 Fetching Activity with ID:", finalActivityId);
      fetchActivity(finalActivityId);
    } else {
      console.error("❌ Error: Activity ID is missing or invalid!");
    }
  }, [finalActivityId]);

  console.log("📌 Activity from Store:", activity);

  if (isLoading) return <p className="text-center text-lg">⏳ กำลังโหลด...</p>;
  if (error) return <p className="text-center text-lg text-red-500">❌ {error}</p>;
  if (!activity) return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;

  return (
    <div className="mt-4 p-6 w-[1110px] h-auto border border-[#ddd] rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-[35px] font-semibold font-sans">{activity.ac_name}</h1>
        <div 
          className="flex items-center text-[25px] gap-[4px] cursor-pointer" 
          onClick={() => navigate('/enrolled_list_admin')}
        >
          {activity.ac_registerant_count}/{activity.ac_seat} <User size={40} />
        </div>
      </div>

      {/* ภาพกิจกรรม */}
      <div className="flex justify-center w-full h-[300px] bg-white border border-black rounded-lg mt-4">
        <img
          src="/img/images.png"
          alt="Activity"
          className="w-[40%] h-full object-cover"
          onError={(e) => (e.currentTarget.src = "/img/default.png")}
        />
      </div>

      {/* รายละเอียดกิจกรรม */}
      <div className="flex items-center justify-between w-full mt-4">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-[25px] font-sans">{activity.ac_company_lecturer}</p>
          <span className="text-[12px] font-semibold bg-[#ceccfb] text-[#0e0cf4] px-2 py-1 w-[90px] text-center font-sans">
            {activity.ac_type}
          </span>
        </div>
        <div className="flex items-center gap-1 font-[Sarabun]">
          <MapPin size={16} /> {activity.ac_room}
        </div>
      </div>

      <p className="mt-2 text-[14px] font-sans">{activity.ac_description}</p>

      {/* รายละเอียดอื่น ๆ */}
      <div className="mt-4">
        <p className="font-semibold font-[Sarabun]">อาหาร</p>
        <select className="w-[40%] p-2 border border-[#ccc] rounded mt-1">
          {activity.ac_food.length > 0 ? (
            activity.ac_food.map((food, index) => (
              <option key={index} className="font-[Sarabun]">{food}</option>
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
            <Clock size={16} /> {activity.ac_start_time} - {activity.ac_end_time}
          </div>
          <div className="flex items-center gap-1 ml-3 font-[Sarabun] font-semibold">
            <Play size={16} /> {activity.ac_state}
          </div>
        </div>

        {/* ปุ่มต่าง ๆ */}
        <div className="flex justify-end gap-3">
          <BackBotton />
          <button className="flex items-center justify-center w-[100px] h-[30px] rounded-[20px] bg-[#1e3a8a] text-white font-bold text-[17px] font-[Sarabun] border-none">
            QR Code
          </button>
          <button className="flex items-center justify-center w-[100px] h-[30px] rounded-[20px] bg-[#1e3a8a] text-white font-bold text-[17px] font-[Sarabun] border-none">
            แก้ไข
          </button>
        </div>
      </div>
    </div>
  );
}