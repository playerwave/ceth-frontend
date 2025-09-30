import React from "react";
import { CircleAlert } from "lucide-react";

interface Dialog1Props {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  icon?: React.ReactNode;
}

const Dialog1: React.FC<Dialog1Props> = ({
  open,
  onClose,
  title,
  message,
  icon = <CircleAlert size={32} className="text-red-500" />, // Default icon
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-[8px] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-lg overflow-hidden flex flex-col">
        {/* ส่วนเนื้อหา */}
        <div className="flex items-start gap-4 sm:gap-6 p-5 sm:p-7 pb-10">
          {/* ช่อง icon */}
          <div className="mt-1 w-[40px] flex justify-center">{icon}</div>

          {/* ข้อความ */}
          <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* ปุ่ม */}
        <div className="bg-gray-100 px-4 sm:px-6 py-4 flex justify-center">
          <button
            onClick={onClose}
            className="bg-[#FF0000] text-white font-semibold px-6 py-2 rounded-md hover:bg-red-700 transition w-28"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog1;
