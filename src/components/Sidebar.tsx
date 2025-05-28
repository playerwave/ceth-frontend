// components/Sidebar/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  BookA,
  History,
  ClipboardList,
  Users,
  BadgeCheck,
  Settings,
  LogOut,
  FileText,
  ChevronLeft,
  ChevronRight,
  StickyNote,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  role: "admin" | "student";
}

const Sidebar = ({ isCollapsed, toggleSidebar, role }: SidebarProps) => {
  const handleNotInThisSprint = () => {
    alert("Use Case นี้จะถูกพัฒนาใน Sprint อื่นๆ ขออภัยในความไม่สะดวก");
  };

  const commonItems = [
    {
      to: role === "admin" ? "/" : "/visiter",
      icon: <StickyNote size={24} />,
      text: "หน้าเยี่ยมชม",
    },
    {
      to: role === "admin" ? "/" : "/main-student",
      icon: <Home size={24} />,
      text: "หน้าหลัก",
    },
    {
      to: role === "admin" ? "/list-activity-admin" : "/list-activity-student",
      icon: <BookA size={24} />,
      text: "กิจกรรมสหกิจ",
    },
    {
      to: "/history",
      icon: <History size={24} />,
      text: "ประวัติกิจกรรม (ห้าม click)",
      onClick: handleNotInThisSprint,
    },
    {
      to: "/certificates",
      icon: <BadgeCheck size={24} />,
      text: "จัดการเกียรติบัตร (ห้าม click)",
      onClick: handleNotInThisSprint,
    },
    {
      to: "/settings",
      icon: <Settings size={24} />,
      text: "ตั้งค่า (ห้าม click)",
      onClick: handleNotInThisSprint,
    },
    {
      to: "/logout",
      icon: <LogOut size={24} />,
      text: "ออกจากระบบ (ห้าม click)",
      onClick: handleNotInThisSprint,
    },
  ];

  const adminOnlyItems = [
    {
      to: "/evaluation",
      icon: <ClipboardList size={24} />,
      text: "แบบประเมิน (ห้าม click)",
      onClick: handleNotInThisSprint,
    },
    {
      to: "/students",
      icon: <Users size={24} />,
      text: "รายชื่อนิสิต (ห้าม click)",
      onClick: handleNotInThisSprint,
    },
    {
      to: "/test_create",
      icon: <FileText size={24} />,
      text: "CRUD Example",
    },
  ];

  const itemsToRender =
    role === "admin"
      ? [...commonItems.slice(0, 2), ...adminOnlyItems, ...commonItems.slice(2)]
      : commonItems;

  return (
    <div
      className={`h-full bg-gray-100 text-gray-900 p-4 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20 shadow-lg" : "w-72 shadow-2xl"
      }`}
    >
      {/* ปุ่มย่อ/ขยาย Sidebar */}
      <div className="flex justify-between items-center mb-4">
        <span
          className={`text-lg font-semibold text-gray-600 transition-all duration-300 ${
            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
          }`}
        >
          Panel
        </span>

        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-200 transition"
        >
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>

      {/* เมนู Sidebar */}
      <div className="flex flex-col space-y-1">
        {itemsToRender.map((item, index) => (
          <SidebarItem key={index} {...item} collapsed={isCollapsed} />
        ))}
      </div>
    </div>
  );
};

const SidebarItem = ({
  to,
  icon,
  text,
  onClick,
  collapsed,
}: {
  to: string;
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  collapsed: boolean;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative flex items-center py-2 px-3 rounded-lg transition-all duration-300 ${
        isActive
          ? "bg-blue-100 text-blue-600 border-l-4 border-blue-500 shadow-md"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span
        className={`transition-all duration-300 whitespace-nowrap ${
          collapsed
            ? "opacity-0 w-0 overflow-hidden"
            : "opacity-100 w-auto ml-3"
        }`}
      >
        {text}
      </span>
    </Link>
  );
};

export default Sidebar;
