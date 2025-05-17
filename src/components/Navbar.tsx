import { useState, useEffect } from "react";

//import component
import SidebarAdmin from "./Sidebar/sidebar_admin";
import SidebarStudent from "./Sidebar/sidebar_student";
import UserProfile from "./userProfile";

// import mui component
import Avatar from "@mui/material/Avatar";

//import authStore
import { useAuthStore } from "../stores/auth.store";

const Navbar = ({ children }) => {
  const { user } = useAuthStore();

  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

  return (
    <div className="flex">
      {/* Navbar (ติดขอบบน) */}
      <div className="fixed top-0 left-0 w-full bg-[#1E3A8A] text-white h-[80px] p-4 z-50 flex justify-between items-center">
        <h1 className="text-2xl">Burapha University</h1>
        <div className="mr-18">
          <UserProfile />
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-[80px] left-0 ${
          isCollapsed ? "w-[80px]" : "w-[280px]"
        } h-[calc(100vh-80px)] z-50 transition-all duration-300`}
      >
        {user?.u_role === "admin" ? (
          <SidebarAdmin
            isCollapsed={isCollapsed}
            toggleSidebar={() => setIsCollapsed(!isCollapsed)}
          />
        ) : (
          <SidebarStudent
            isCollapsed={isCollapsed}
            toggleSidebar={() => setIsCollapsed(!isCollapsed)}
          />
        )}
      </div>

      {/* Content (เว้นที่ให้ Sidebar และให้มี min-height) */}
      <div
        className={`flex-grow min-h-screen transition-all duration-300`}
        style={{
          marginTop: "80px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Navbar;
