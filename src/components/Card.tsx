import React from "react";

interface CustomCardProps {
  height?: string | number; // Optional เพื่อให้สามารถไม่ส่งก็ได้
  width?: string | number;
  children: React.ReactNode;
  className?: string;
}

const CustomCard: React.FC<CustomCardProps> = ({
  height,
  width,
  children,
  className,
}) => {
  return (
    <div
      className={`bg-white shadow-md p-4 rounded-[20px] ${className ?? ""}`}
      style={{ height, width }}
    >
      {children}
    </div>
  );
};

export default CustomCard;
