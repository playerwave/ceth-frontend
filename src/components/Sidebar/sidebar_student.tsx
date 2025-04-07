import { Link, useLocation, useNavigate } from "react-router-dom";
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
} from "lucide-react";

//import authStore
import { useAuthStore } from "../../stores/auth.store";

const SidebarStudent = () => {
  // ✅ โหลดค่า `isCollapsed` จาก LocalStorage ถ้ามี
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  // ✅ เมื่อ `isCollapsed` เปลี่ยน, อัปเดตค่าใน LocalStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // ✅ กลับไปหน้าล็อกอิน
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  const handleNotInThisSprint = () => {
    alert("Use Case นี้จะถูกพัฒนาใน Sprint อื่นๆ ขออภัยในความไม่สะดวก");
  };

  return (
    <div
      className={`h-screen bg-gray-100 text-gray-900 p-4 flex flex-col transition-all duration-300 ${
        isCollapsed
          ? "w-20 shadow-lg shadow-gray-400"
          : "w-72 shadow-2xl shadow-gray-400"
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
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-200 transition"
        >
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>

      {/* เมนู Sidebar */}
      <div className="flex flex-col space-y-1">
        <SidebarItem
          to="/main-student"
          icon={<Home size={24} />}
          text="หน้าหลัก"
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/list-activity-student"
          icon={<BookA size={24} />}
          text="กิจกรรมสหกิจ"
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/history"
          icon={<History size={24} />}
          text="ประวัติกิจกรรม (ห้าม click)"
          onClick={handleNotInThisSprint}
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/certificates"
          icon={<BadgeCheck size={24} />}
          text="จัดการเกียรติบัตร (ห้าม click)"
          onClick={handleNotInThisSprint}
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/settings"
          icon={<Settings size={24} />}
          text="ตั้งค่า (ห้าม click)"
          onClick={handleNotInThisSprint}
          collapsed={isCollapsed}
        />
        <div className="mt-90">
          <SidebarItem
            to="#"
            icon={<LogOut size={24} />}
            text="ออกจากระบบ"
            onClick={handleLogout}
            collapsed={isCollapsed}
          />
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ to, icon, text, onClick, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const isDisabled = typeof onClick === "function" && to !== "#";

  const commonClass = `relative flex items-center py-2 px-3 rounded-lg transition-all duration-300 ${
    isActive
      ? "bg-blue-100 text-blue-600 border-l-4 border-blue-500 shadow-md"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  } ${collapsed ? "justify-center" : ""} ${
    isDisabled ? "cursor-not-allowed opacity-50" : ""
  }`;

  const content = (
    <>
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
    </>
  );

  // ถ้าคลิกไม่ได้ -> ไม่ต้องใช้ Link
  return isDisabled ? (
    <div className={commonClass} onClick={onClick}>
      {content}
    </div>
  ) : (
    <Link to={to} onClick={onClick} className={commonClass}>
      {content}
    </Link>
  );
};

export default SidebarStudent;
