import React from "react";
import clsx from "clsx"; // ใช้ clsx เพื่อจัดการ className แบบ dynamic

interface ButtonProps {
  children: React.ReactNode;
  color?: "blue" | "red" | "white"; // กำหนดสีที่รองรับ
  width?: string; // สามารถใส่ width ได้ เช่น "200px", "100%", "w-40" (Tailwind)
}

const Button: React.FC<ButtonProps> = ({
  children,
  color = "blue",
  width = "auto",
}) => {
  return (
    <button
      className={clsx(
        "text-white text-lg font-semibold px-6 py-2 rounded-full shadow-md transition",
        {
          "bg-[#1E3A8A]": color === "blue",
          "bg-[#FF0000]": color === "red",
          "bg-white text-black border border-gray-300": color === "white",
        }
      )}
      style={{ width: width }} // ใช้ inline styles เพื่อกำหนด width
    >
      {children}
    </button>
  );
};

export default Button;
