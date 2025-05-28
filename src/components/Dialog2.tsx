import React from "react";

interface Dialog1Props {
  open: boolean;
  title: string;
  message: string;
  icon?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  type?: "button" | "submit";
}

const Dialog2: React.FC<Dialog1Props> = ({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-[8px] w-full max-w-md shadow-lg overflow-hidden flex flex-col">
        {/* ส่วนเนื้อหา */}
        <div className="flex items-start gap-6 p-7 pb-12">
          {/* ช่อง icon - จองที่ไว้เสมอ */}
          <div className="ml-2 mt-1 w-[40px] flex justify-center">{icon}</div>

          {/* ข้อความ */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-gray-500 mt-1 text-sm">{message}</p>
          </div>
        </div>

        {/* แถบสีเทาพร้อมปุ่มตรงกลาง */}
        <div className="bg-gray-100 px-6 py-4 flex justify-end items-center gap-6">
          <button
            onClick={onClose}
            className="text-red-600 font-medium hover:underline"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            type={type}
            className="bg-[#1D4ED8] text-white font-semibold px-4 py-2 rounded-[4px] hover:bg-blue-800 transition"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog2;
