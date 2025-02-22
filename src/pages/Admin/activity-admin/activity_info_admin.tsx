import { Clock, MapPin, Play, User } from "lucide-react";
import BackBotton from "../../../components/botton/back_botton";

export default function activity_info_admin() {
    return (
      <div className="mt-[10px] p-6 w-[1110px] h-[650px] ml-0 border border-[#ddd] rounded-lg shadow-md">
      {/* ส่วนหัว */}
      <div className="flex justify-between items-center">
        <h1 className="text-[35px] font-semibold font-sans">
          Participating in cooperative education activities
        </h1>
        <div 
          className="flex items-center text-[25px] gap-[4px] cursor-pointer" 
          onClick={() => window.location.href = '/enrolled_list_admin'}
        >
          50/50 <User size={40} />
        </div>
      </div>
  
      {/* ส่วนรูปภาพ */}
      <div className="flex justify-center w-full h-[300px] bg-white border border-black rounded-lg mt-4">
        <img
          src="public\img\images.png"
          alt="My Image"
          className="w-[40%] h-full object-cover"
        />
      </div>
  
      {/* ส่วนเนื้อหา + Soft Skill */}
      <div className="flex items-center justify-between w-full mt-4">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-[25px] font-sans m-0">
            Clicknext
          </p>
          <span className="text-[12px] font-semibold bg-[#ceccfb] text-[#0e0cf4] px-2 py-1 w-[90px] text-center font-sans">
            Soft Skill
          </span>
        </div>
        <div className="flex items-center gap-1 font-[Sarabun]">
          <MapPin size={16} /> ชั้น 3 ห้อง 3M210
        </div>
      </div>
  
      <p className="mt-2 text-[14px] font-sans">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis egestas rhoncus. 
        Donec feugiat, nisi in facilisis facilisis, nunc mauris tristique felis, euismod tincidunt. 
        Let me know if you need a different length!
      </p>
  
      {/* ส่วนเลือกอาหาร */}
      <div className="mt-4">
        <p className="font-semibold font-[Sarabun]">อาหาร</p>
        <select className="w-[40%] p-2 border border-[#ccc] rounded mt-1">
          <option className="font-[Sarabun]">ข้าวกะเพราหมูสับไข่ดาว</option>
        </select>
      </div>
  
      {/* เวลา + สถานะ + ปุ่มต่าง ๆ */}
      <div className="flex justify-between items-center mt-4 text-[14px]">
        {/* แสดงเวลา */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-[Sarabun] font-semibold">
            <Clock size={16} /> 01:00 PM - 04:00 PM
          </div>
          <div className="flex items-center gap-1 ml-3 font-[Sarabun] font-semibold">
            <Play size={16} /> กำลังดำเนินการ...
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