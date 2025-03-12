import { useState, useEffect } from "react";
import Sidebar from "./Sidebar/sidebar_admin";

const Navbar = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

  return (
    <div className="flex">
      {/* Navbar (ติดขอบบน) */}
      <div className="fixed top-0 left-0 w-full bg-[#1E3A8A] text-white h-[80px] p-4 z-50">
        <h2>BUU</h2>
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
        />
      </div>

      {/* Content (เว้นที่ให้ Sidebar และให้มี min-height) */}
      <div
        className={`flex-grow min-h-screen transition-all duration-300`}
        style={{
          marginLeft: isCollapsed ? "80px" : "280px",
          marginTop: "80px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Navbar;
