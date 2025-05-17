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
import { useAuthStore } from "../../stores/auth.store";

const SidebarAdmin = ({ isCollapsed, toggleSidebar }) => {
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

  // ✅ โหลดค่า `isCollapsed` จาก LocalStorage ถ้ามี
  // const [isCollapsed, setIsCollapsed] = useState(() => {
  //   const stored = localStorage.getItem("sidebarCollapsed");
  //   console.log("▶ sidebarCollapsed from localStorage:", stored); // Debug ตรงนี้
  //   return stored !== null ? stored === "true" : true; // หุบโดย default
  // });

  // // ✅ เมื่อ `isCollapsed` เปลี่ยน, อัปเดตค่าใน LocalStorage
  // useEffect(() => {
  //   localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
  // }, [isCollapsed]);

  const handleNotInThisSprint = () => {
    alert("Use Case นี้จะถูกพัฒนาใน Sprint อื่นๆ ขออภัยในความไม่สะดวก");
  };

  return (
    <div className="w-240px h-screen bg-[3A3F44] text-white p-4">
      <div className="space-y-2">
        <Link to="/">
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            หน้าหลัก
          </button>
        </Link>
        <Link to="/list-activity-admin">
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            กิจกรรมสหกิจ
          </button>
        </Link>
        <Link to="/List-activity-student">
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            กิจกรรมนิสิต
          </button>
        </Link>
        <Link to="/" onClick={handleNotInthisSprint}>
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            แบบประเมิน
          </button>
        </Link>
        <Link to="/" onClick={handleNotInthisSprint}>
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            รายชื่อนิสิต
          </button>
        </Link>
        <Link to="/" onClick={handleNotInthisSprint}>
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            จัดการเกียรติบัตร
          </button>
        </Link>
        <Link to="/" onClick={handleNotInthisSprint}>
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            setting
          </button>
        </Link>
        <Link to="/" onClick={handleNotInthisSprint}>
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            logout
          </button>
        </Link>
        <Link to="/crud-test">
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            CRUD Example
          </button>
        </Link>
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

export default SidebarAdmin;
