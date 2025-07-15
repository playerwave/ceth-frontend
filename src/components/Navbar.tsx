import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "../stores/Visitor/auth.store";

import { ReactNode } from "react";

type NavbarProps = {
  children: ReactNode;
};

const Navbar = ({ children }: NavbarProps) => {
  const location = useLocation();
  const { user } = useAuthStore();

  // เก็บสถานะย่อ Sidebar ไว้ใน localStorage เฉพาะ desktop
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true",
  );

  // เก็บ role ใน state ธรรมดา (ไม่ใช้ localStorage)
  // const [role, setRole] = useState<"student" | "admin">("student");

const role: "student" | "admin" =
  user?.role === "Student" ? "student" : "admin";


  // ตรวจสอบขนาดหน้าจอ ตั้งแต่โหลดแรก
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  // สถานะเมนูมือถือเปิด/ปิด
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ตรวจจับขนาดหน้าจอเวลาเปลี่ยนขนาด
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ปิดเมนูมือถือเมื่อเปลี่ยนเส้นทาง
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // บันทึกสถานะ Sidebar เฉพาะ desktop
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

  // แสดง Sidebar ย่อเฉพาะ desktop เท่านั้น
  const showSidebarCollapsed = !isMobile && isCollapsed;

  return (
    <>
      {/* Navbar ด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-[#1E3A8A] text-white h-[80px] p-4 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}
          <h1 className="text-2xl font-bold">Burapha University</h1>
        </div>
        <div>
          user: {user?.username || "Guest"}  
        </div>
        
      </div>

      {/* Sidebar สำหรับ Desktop */}
      {!isMobile && (
        <div
          className={`fixed top-[80px] left-0 ${
            showSidebarCollapsed ? "w-[80px]" : "w-[280px]"
          } h-[calc(100vh-80px)] z-40 transition-all duration-300`}
        >
          {/* <Sidebar
            isCollapsed={showSidebarCollapsed}
            toggleSidebar={() => setIsCollapsed(!isCollapsed)}
            role={role}
          /> */}

          <Sidebar
  isCollapsed={showSidebarCollapsed}
  toggleSidebar={() => setIsCollapsed(!isCollapsed)}
  role={role}
/>

        </div>
      )}

      {/* Sidebar และ Backdrop สำหรับ Mobile */}
      {isMobile && mobileMenuOpen && (
        <>
          {/* Backdrop สีเทาโปร่งเต็มจอ */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] bg-black/40 z-40"
          />

          {/* Sidebar overlay ทับบนเนื้อหา */}
          <div className="fixed top-[80px] left-0 w-[75vw] max-w-[280px] h-[calc(100vh-80px)] z-50 bg-white shadow-lg">
            <Sidebar
              isCollapsed={false}
              toggleSidebar={() => setMobileMenuOpen(false)}
              role={role}
            />
          </div>
        </>
      )}

      <div
        className="flex-grow min-h-screen transition-all duration-300 pt-[40px]"
        style={{ marginTop: "60px" }}
      >
        {children}
      </div>

      {/* <div
  className={`flex-grow transition-all duration-300 min-h-screen pt-[88px] ${
    !isMobile ? (showSidebarCollapsed ? "pl-[80px]" : "pl-[280px]") : "pl-0"
  }`}
>
        {children}
      </div> */}


    </> 
    
  );
};

export default Navbar;
