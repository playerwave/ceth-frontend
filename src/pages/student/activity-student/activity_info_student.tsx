import { useActivityStore } from "../../../stores/activity_store";
import { Clock, MapPin, Play, User, CalendarDays, Hourglass } from "lucide-react";
import { useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function ActivityInfoStudent(){

    // const { id: paramId } = useParams();
    // const location = useLocation();
    // const id = location.state?.id || paramId; // ✅ ใช้ state หรือ param ถ้ามี
    // const finalActivityId = id ? Number(id) : null;
    // const navigate = useNavigate();

    // const { activity, isLoading, error, fetchActivity } = useActivityStore();

    // const fetchActivityData = useCallback(() => {
    //     if (finalActivityId !== null && !isNaN(finalActivityId)) {
    //     console.log("📡 Fetching Activity with ID:", finalActivityId);
    //     fetchActivity(finalActivityId);
    //     } else {
    //     console.error("❌ Error: Activity ID is missing or invalid!");
    //     }
    // }, [finalActivityId, fetchActivity]);

    // useEffect(() => {
    //     fetchActivityData();
    // }, [fetchActivityData]);

    // console.log("📌 Activity from Store:", activity);

    // if (isLoading) return <p className="text-center text-lg">⏳ กำลังโหลด...</p>;
    // if (error)
    //     return <p className="text-center text-lg text-red-500">❌ {error}</p>;
    // if (!activity) return <p className="text-center text-lg">⚠️ ไม่พบกิจกรรม</p>;

    // const formatTime = (date) => {
    //     let hours = date.getHours();
    //     let minutes = date.getMinutes();
    //     let ampm = hours >= 12 ? "PM" : "AM";
    //     hours = hours % 12 || 12; // แปลง 0 เป็น 12
    //     minutes = minutes.toString().padStart(2, "0"); // เติม 0 ข้างหน้า ถ้าจำนวนน้อยกว่า 10
    //     return `${hours}:${minutes} ${ampm}`;
    // };

    // const handleToUpdateActivity = (id: string) => {
    //     navigate("/update-activity-admin", { state: { id } }); // ✅ ส่ง `id` ไปเป็น state
    // };

    return (
    <div className="justify-items-center">
        <div className="w-320 h-230 mx-auto ml-2xl mt-5 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
            <h1 className="text-[35px] font-semibold font-sans">
            Participating in cooperative education activities
            {/* {activity.name} */}
            </h1>
            <div className="flex items-center text-[25px] gap-[4px] cursor-pointer">
                50/50 <User size={40} />
                {/* {activity.registered_count}/{activity.seat} <User size={40} /> */}
            </div>
            </div>

            {/* ภาพกิจกรรม */}
            <div className="flex justify-center w-full h-130 bg-white border border-black rounded-lg mt-4">
            <img
                src="public\img\images.png"// ✅ ใช้ image_data ที่แปลงจาก Buffer เป็น Base64 แล้ว
                // src={activity.image_data}
                alt="Activity"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => (e.currentTarget.src = "/img/default.png")} // ✅ ใช้ default image เมื่อโหลดไม่สำเร็จ
            />
            </div>

            {/* รายละเอียดกิจกรรม */}
            <div className="flex items-center justify-between w-full mt-4">
            <div className="flex items-center gap-2">
                <p className="font-semibold text-[25px] font-sans">
                {/* {activity.company_lecturer} */} Clicknext
                </p>
                <span className="text-[12px] font-semibold bg-[#ceccfb] text-[#0e0cf4] px-2 py-1 w-[90px] text-center font-sans">
                {/* {activity.type}  */} Soft Skill
                </span>
                <p className="text-[#0A7A00] text-[25px] font-sans">
                +3 hrs
                </p>
            </div>
            <div className="flex items-center gap-1 font-[Sarabun]">
                <CalendarDays size={25} /> 06/02/2025
                {/* วันที่จัดกิจกรรม{" "}
                {activity.start_time
                ? new Date(activity.start_time).getDate()
                : "ไม่ระบุ"}{" "}
                /
                {activity.start_time
                ? new Date(activity.start_time).getMonth() + 1 // ✅ แก้ไขตรงนี้
                : "ไม่ระบุ"}{" "}
                /
                {activity.start_time
                ? new Date(activity.start_time).getFullYear()
                : "ไม่ระบุ"}{" "}
                <Hourglass size={25} /> ปิดลงทะเบียน{" "}
                {activity.end_register
                ? new Date(activity.end_register).getDate()
                : "ไม่ระบุ"}{" "}
                /
                {activity.end_register
                ? new Date(activity.end_register).getMonth() + 1 // ✅ แก้ไขตรงนี้
                : "ไม่ระบุ"}{" "}
                /
                {activity.end_register
                ? new Date(activity.end_register).getFullYear()
                : "ไม่ระบุ"}{" "} */}
            </div>
            <div className="flex items-center gap-1 font-[Sarabun]">
                <Hourglass size={25} /> ปิดลงทะเบียน 13/02/2025
            </div>
            <div className="flex items-center gap-1 font-[Sarabun]">
                <MapPin size={25} /> ชั้น 3 ห้อง 3M210
                {/* <MapPin size={25} /> ชั้น {activity.room[0]} ห้อง {activity.room} */}
            </div>
            </div>
            <br />
            <p className="mt-2 text-[14px] font-sans">Lorem ipsum dolor sit amet...Lorem ipsum dolor sit amet...Lorem ipsum dolor sit amet...Lorem ipsum dolor sit amet...Lorem ipsum dolor sit amet...Lorem ipsum dolor sit amet...Lorem ipsum dolor sit amet...Lorem ipsum dolor sit amet...Lorem ipsum dolor sit amet...Lorem ipsum dolor sit amet...</p>
            <br />
            {/*เลือก อาหาร*/}
            <div className="mt-4">
            <p className="font-semibold font-[Sarabun]">อาหาร</p>
                <select className="w-[40%] p-2 border border-[#ccc] rounded mt-1">
                    <option className="font-[Sarabun]">ข้าวกะเพราหมูสับไข่ดาว</option>
                </select>
            </div>
            {/*เลือก อาหาร*/}
                {/* <div className="mt-4">
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
                </div> */}

            {/* เวลา + สถานะ + ปุ่มต่าง ๆ */}
            <div className="flex justify-between items-center mt-4 text-[14px]">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 font-[Sarabun] font-semibold">
                <Clock size={25} /> 13:00:00 - 16:00:00
                {/* {activity.start_time
                    ? formatTime(new Date(activity.start_time))
                    : "ไม่ระบุ"}{" "}
                -{" "}
                {activity.end_time
                    ? formatTime(new Date(activity.end_time))
                    : "ไม่ระบุ"} */}
                </div>

                <div className="flex items-center gap-1 ml-3 font-[Sarabun] font-semibold">
                <Play size={25} /> รอดำเนินการ . . .
                {/* <Play size={25} /> {activity.state} */}
                </div>
            </div>

            {/* ปุ่มต่าง ๆ */}
            <div className="flex justify-end gap-3">
                <button className="flex items-center justify-center gap-2 w-[100px] h-[30px] rounded-[20px] bg-[#FF0000] text-white font-bold text-[17px] font-[Sarabun] border-none"
                onClick={() => window.history.back()}>
                    ยกเลิก
                </button>
                <button className="flex items-center justify-center w-[100px] h-[30px] rounded-[20px] bg-[#1e3a8a] text-white font-bold text-[17px] font-[Sarabun] border-none">
                    ลงทะเบียน
                </button>
            </div>
            </div>
        </div>
        </div>
    )
}