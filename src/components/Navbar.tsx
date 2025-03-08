import { useState, useEffect } from "react";
import Sidebar from "./Sidebar/sidebar_admin";

const Navbar = ({ children }) => {
  // ✅ โหลดค่า `isCollapsed` จาก LocalStorage ถ้ามี
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  // ✅ เมื่อ `isCollapsed` เปลี่ยน, อัปเดตค่าใน LocalStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

  return (
    <div className="flex">
      {/* Navbar (ติดขอบบน) */}
      <div className="fixed top-0 left-0 w-full bg-[#1E3A8A] text-white h-80px p-4 z-50">
        <h2>BUU</h2>
      </div>

      {/* Sidebar (สามารถย่อ/ขยาย และจำค่าได้หลังรีเฟรช) */}
      <div
        className={`fixed top-[56px] left-0 ${
          isCollapsed ? "w-[80px]" : "w-[280px]"
        } h-[calc(100vh-56px)] z-50 transition-all duration-300`}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Content (เว้นที่ให้ Sidebar) */}
      <div
        className={`ml-[${
          isCollapsed ? "80px" : "280px"
        }] mt-[35px] w-full p-4`}
      >
        {children}
      </div>
    </div>
  );
};

export default Navbar;
