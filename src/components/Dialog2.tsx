import React from "react";

interface Dialog2Props {
  open: boolean;
  title: string;
  message: React.ReactNode;
  icon?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  type?: "button" | "submit";
}

const Dialog2: React.FC<Dialog2Props> = ({
  open,
  title,
  message,
  icon,
  onClose,
  onConfirm,
  type = "button",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-[8px] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-lg overflow-hidden flex flex-col">
        {/* เนื้อหา */}
        <div className="flex items-start gap-4 sm:gap-6 p-5 sm:p-6">
          {/* ไอคอน */}
          <div className="w-[40px] flex justify-center">{icon}</div>

          {/* ข้อความ */}
          <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold mb-2">{title}</h2>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {message}
            </div>
          </div>
        </div>

        {/* ปุ่ม */}
        <div className="bg-gray-100 px-4 sm:px-6 py-4 flex flex-wrap justify-end gap-4">
          <button
            onClick={onClose}
            className="text-red-600 font-medium hover:underline whitespace-nowrap"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            type={type}
            className="bg-[#1E3A8A] text-white font-semibold px-4 py-2 rounded hover:bg-blue-800 transition whitespace-nowrap"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog2;
