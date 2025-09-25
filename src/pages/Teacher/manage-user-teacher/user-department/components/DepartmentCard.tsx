import React from "react";

interface DepartmentCardProps {
  departmentCode: string;
  departmentName: string;
  onClick?: () => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  departmentCode,
  departmentName,
  onClick,
}) => {
  return (
    <div className="w-full h-48 flex items-center justify-center">
      <div
        onClick={onClick}
        className="card w-100 h-60 bg-gray-200/60 border border-white shadow-[12px_17px_51px_rgba(0,0,0,0.22)] backdrop-blur-[6px] rounded-[17px] text-center cursor-pointer transition-all duration-500 flex items-center justify-center select-none font-bold hover:border-blue-500 hover:scale-105 active:scale-95 active:rotate-[1.7deg] group"
      >
        <div className="flex flex-col items-center justify-center">
          <span className="text-5xl font-bold" style={{ color: '#1E3A8A' }}>
            {departmentCode}
          </span>
          <span className="text-sm font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
            {departmentName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;
