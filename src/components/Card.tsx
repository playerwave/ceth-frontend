import React from "react";

interface CustomCardProps {
  height?: string | number; // Optional เพื่อให้สามารถไม่ส่งก็ได้
  width?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  children: React.ReactNode;
  className?: string;
}

const CustomCard: React.FC<CustomCardProps> = ({
  height,
  width,
  minHeight,
  maxHeight,
  minWidth,
  maxWidth,
  children,
  className,
}) => {
  return (
    <div
      className={`bg-white shadow-md p-8 rounded-[20px] w-full ${className ?? ""}`}
      style={{ 
        height, 
        width: width || "100%",
        minHeight,
        maxHeight,
        minWidth,
        maxWidth
      }}
    >
      {children}
    </div>
  );
};

export default CustomCard;
