import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Button from "./Button";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "../stores/Visitor/auth.store";
import { useNavigate } from "react-router-dom";

import { ReactNode } from "react";

type NavbarProps = {
  children: ReactNode;
};

const Navbar = ({ children }: NavbarProps) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

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

  const isVisitorPath = location.pathname.includes("visitor");


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
          <h1 className="text-2xl font-bold ml-10">Burapha University</h1>
        </div>
        {/* <div className="flex flex-col items-start gap-1 p-2 border rounded-md bg-white shadow-sm">
      <div className="text-sm text-gray-700 font-semibold">
        {user?.username}
      </div>
      <div className="text-xs text-gray-500">
         {user?.role || "ไม่ระบุ"}
      </div>
    </div> */}
        {/* {isAuthenticated && user ? (
  <div className="flex flex-col items-start gap-1 p-2 border rounded-md  shadow-sm">
    <div className="text-sm text-white-700 font-semibold">
      {user.username}
    </div>
    <div className="text-xs text-white-500">
      {user.role || "ไม่ระบุ"}
    </div>
  </div>
) : (
  <button
    onClick={() => navigate("/login")}
    className="px-4 py-1 text-sm rounded-md bg-white text-blue-700 hover:bg-blue-100 transition"
  >
    เข้าสู่ระบบ
  </button>
)} */}

{isAuthenticated && user ? (
  <div className="flex flex-col items-start gap-1 mr-15">
    <div className="text-base text-white font-semibold">
      {user.username}
    </div>
    <div className="text-sm text-white">
      {user.role || "ไม่ระบุ"}
    </div>
  </div>
) : (
  // <button
  //   onClick={() => navigate("/login")}
  //   className="px-4 py-1 text-sm rounded-md bg-white text-blue-700 hover:bg-blue-100 transition"
  // >
  //   เข้าสู่ระบบ
  // </button>
  <Button
      bgColor="#FFFFFF" // พื้นหลังขาว
      textColor="#1E3A8A" // ตัวอักษรน้ำเงิน (Tailwind: text-blue-800)
      onClick={() => navigate("/login")}
      className="hover:bg-blue-100"
    >
      เข้าสู่ระบบ
    </Button>
)}


      </div>

      {/* Sidebar สำหรับ Desktop */}
      {/* {!isMobile && (
        <div
          className={`fixed top-[80px] left-0 ${
            showSidebarCollapsed ? "w-[80px]" : "w-[280px]"
          } h-[calc(100vh-80px)] z-40 transition-all duration-300`}
        >

          <Sidebar
  isCollapsed={showSidebarCollapsed}
  toggleSidebar={() => setIsCollapsed(!isCollapsed)}
  role={role}
/>

        </div>
      )} */}

      {isMobile && mobileMenuOpen && !isVisitorPath && (
  <>
    <div
      onClick={() => setMobileMenuOpen(false)}
      className="fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] bg-black/40 z-40"
    />
    <div className="fixed top-[80px] left-0 w-[75vw] max-w-[280px] h-[calc(100vh-80px)] z-50 bg-white shadow-lg">
      <Sidebar
        isCollapsed={false}
        toggleSidebar={() => setMobileMenuOpen(false)}
        role={role}
      />
    </div>
  </>
)}


      {/* Sidebar และ Backdrop สำหรับ Mobile */}
      {/* {isMobile && mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] bg-black/40 z-40"
          />


          <div className="fixed top-[80px] left-0 w-[75vw] max-w-[280px] h-[calc(100vh-80px)] z-50 bg-white shadow-lg">
            <Sidebar
              isCollapsed={false}
              toggleSidebar={() => setMobileMenuOpen(false)}
              role={role}
            />
          </div>
        </>
      )} */}

      {isMobile && mobileMenuOpen && !isVisitorPath && (
  <>
    <div
      onClick={() => setMobileMenuOpen(false)}
      className="fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] bg-black/40 z-40"
    />
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
