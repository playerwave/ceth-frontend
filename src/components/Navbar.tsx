import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

const Navbar = ({ children }) => {
  const location = useLocation();

  // ✅ ใช้ localStorage เฉพาะ isCollapsed (ไม่ใช้กับ role)
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  // ❌ ไม่เก็บ role ลง localStorage (แค่ state)
  const [role, setRole] = useState<"student" | "admin">("student");

  // ✅ ตรวจขนาดหน้าจอทันทีที่โหลด (เพื่อให้ hamburger แสดง)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ ตรวจหน้าจอเมื่อ resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ ปิดเมนู mobile เมื่อเปลี่ยนเส้นทาง
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // ✅ บันทึก isCollapsed ใน desktop
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
    }
  }, [isCollapsed, isMobile]);

  // ✅ ล้างค่าเมื่อเข้า mobile
  useEffect(() => {
    if (isMobile) {
      localStorage.removeItem("sidebarCollapsed");
    }
  }, [isMobile]);

  // ✅ toggle role เฉย ๆ ไม่เก็บถาวร
  const toggleRole = () => {
    setRole((prev) => (prev === "admin" ? "student" : "admin"));
  };

  const showSidebarCollapsed = !isMobile && isCollapsed;

  return (
    <div className="flex">
      {/* Navbar */}
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
        <button
          onClick={toggleRole}
          className="bg-white text-[#1E3A8A] px-4 py-2 rounded text-sm"
        >
          สลับเป็น {role === "admin" ? "Student" : "Admin"}
          <br />
          (ทดสอบ)
        </button>
      </div>

      {/* Sidebar - Desktop */}
      {!isMobile && (
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
      )}

      {/* Sidebar - Mobile */}
      {isMobile && mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] bg-black bg-opacity-40 z-40"
          ></div>

          <div className="fixed top-[80px] left-0 w-[75vw] max-w-[280px] h-[calc(100vh-80px)] z-50 bg-white shadow-lg">
            <Sidebar
              isCollapsed={false}
              toggleSidebar={() => setMobileMenuOpen(false)}
              role={role}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div
        className="flex-grow min-h-screen transition-all duration-300"
        style={{
          marginLeft: isMobile ? 0 : showSidebarCollapsed ? "80px" : "280px",
          marginTop: "80px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Navbar;
