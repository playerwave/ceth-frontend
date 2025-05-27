// import React from "react";
// import clsx from "clsx"; // ใช้ clsx เพื่อจัดการ className แบบ dynamic

// interface ButtonProps {
//   children: React.ReactNode;
//   color?: "blue" | "red" | "white"; // กำหนดสีที่รองรับ
//   width?: string; // สามารถใส่ width ได้ เช่น "200px", "100%", "w-40" (Tailwind)
// }

// const Button: React.FC<ButtonProps> = ({
//   children,
//   color = "blue",
//   width = "auto",
// }) => {
//   return (
//     <button
//       className={clsx(
//         "text-white text-lg font-semibold px-6 py-2 rounded-full shadow-md transition",
//         {
//           "bg-[#1E3A8A]": color === "blue",
//           "bg-[#FF0000]": color === "red",
//           "bg-white text-black border border-gray-300": color === "white",
//         }
//       )}
//       style={{ width: width }} // ใช้ inline styles เพื่อกำหนด width
//     >
//       {children}
//     </button>
//   );
// };

// export default Button;

import React from "react";
import clsx from "clsx"; // ใช้ clsx เพื่อจัดการ className แบบ dynamic

interface ButtonProps {
  children: React.ReactNode;
  color?: "blue" | "red" | "white"; // รองรับสีที่กำหนด
  width?: string; // รองรับ width เช่น "200px", "100%", "w-40" (Tailwind)
  type?: "button" | "submit" | "reset"; // รองรับ type ของ button
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // กำหนดฟังก์ชัน onClick
  className?: string; // ✅ เพิ่ม className
  startIcon?: React.ReactNode; // ✅ เพิ่ม startIcon
  variant?: "contained" | "text" | "outlined"; // ✅ ต้องมีบรรทัดนี้
}

const Button: React.FC<ButtonProps> = ({
  children,
  color = "blue",
  width = "auto",
  type = "button", // ค่า default เป็น "button" เพื่อป้องกันการ submit
  onClick, 
  className,         // ✅ เพิ่มตรงนี้
  startIcon,
}) => {
  return (
    <button
      type={type} // กำหนด type ให้ปุ่ม
      onClick={onClick} // รองรับ onClick
      className={clsx(
        "text-white text-lg font-semibold px-6 py-2 rounded-full shadow-md transition duration-200",
        {
          "bg-[#1E3A8A] hover:bg-[#162E6F]": color === "blue",
          "bg-[#FF0000] hover:bg-[#CC0000]": color === "red",
          "bg-white text-black border border-gray-300 hover:bg-gray-100":
            color === "white",
        },
        className // ✅ เพิ่ม className จาก props
      )}
      style={{ width: width }} // ใช้ inline styles เพื่อกำหนด width
    >
      {children}
    </button>
  );
};

export default Button;
