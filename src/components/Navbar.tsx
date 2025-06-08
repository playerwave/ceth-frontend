import { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; // ใช้ไฟล์เดียวแทน admin/student

const Navbar = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  const [role, setRole] = useState<"student" | "admin">("student");

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
    }
  }, [isCollapsed, isMobile]);

  // ลบสถานะ Sidebar เมื่อเป็นมือถือ (กันบั๊ก)
  useEffect(() => {
    if (isMobile) {
      localStorage.removeItem("sidebarCollapsed");
    }
  }, [isMobile]);

  // ฟังก์ชันสลับ role แบบธรรมดา
  const toggleRole = () => {
    setRole((prev) => (prev === "admin" ? "student" : "admin"));
  };

  // แสดง Sidebar ย่อเฉพาะ desktop เท่านั้น
  const showSidebarCollapsed = !isMobile && isCollapsed;

  return (
    <div className="flex w-full h-full overflow-x-hidden">
      {/* Navbar (ติดขอบบน) */}
      <div className="fixed top-0 left-0 w-full bg-[#1E3A8A] text-white h-[80px] p-4 z-50 flex justify-between items-center">
        <h1 className="text-2xl">Burapha University</h1>
        <button
          onClick={() => setRole(role === "admin" ? "student" : "admin")}
          className="bg-white text-[#1E3A8A] px-4 py-2 rounded"
        >
          สลับเป็น {role === "admin" ? "Student" : "Admin"}
          <br />
          (สำหรับการทดสอบเท่านั้น)
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-[80px] left-0 ${
          isCollapsed ? "w-[80px]" : "w-[280px]"
        } h-[calc(100vh-80px)] z-50 transition-all duration-300`}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={() => setIsCollapsed(!isCollapsed)}
          role={role}
        />
      </div>

      {/* Content */}
      <div
        className={`flex-grow min-h-screen transition-all duration-300 ${
          isCollapsed ? "ml-[80px]" : "ml-[280px]"
        } mt-[80px] overflow-x-hidden`}
      >
        {children}
      </div>
    </div>
  );
};

export default Navbar;
