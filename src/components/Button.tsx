import React from "react";
import clsx from "clsx";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  bgColor?: string;     // สีพื้นหลัง (override ได้)
  textColor?: string;   // สีข้อความ
  width?: string;       // "200px" | "100%" ฯลฯ
  startIcon?: React.ReactNode;
  variant?: "contained" | "text" | "outlined";
}

const Button: React.FC<ButtonProps> = ({
  children,
  bgColor = "#1E3A8A",
  textColor = "#FFFFFF",
  width = "auto",
  type = "button",
  onClick,
  className,
  startIcon,
  disabled,            // ✅ มาจาก ButtonHTMLAttributes แล้ว
  ...rest              // รับ prop อื่น ๆ (aria-*, id, etc.)
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}                 // ✅ ใช้จริง
      aria-disabled={disabled || undefined}
      className={clsx(
        "font-semibold transition duration-200 shadow-md rounded-[20px] flex items-center justify-center",
        "text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px]",
        "px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3",
        "cursor-pointer hover:opacity-90",
        disabled && "opacity-90 cursor-not-allowed",
        className
      )}
      style={{
        width,
        backgroundColor: bgColor,  // ใช้คู่กับเงื่อนไขภายนอกได้ เช่น submitted ? เขียว : undefined
        color: textColor,
      }}
      {...rest}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
    </button>
  );
};

export default Button;
