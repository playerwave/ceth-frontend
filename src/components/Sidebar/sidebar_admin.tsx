import { Link } from "react-router-dom";

const sidebar_admin = () => {
  const handleNotInthisSprint = () => {
    alert("Use Case นี้จะถถูกพัฒนาใน Sprint อื่นๆ ขออภัยในความไม่สะดวก");
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
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-200 transition"
        >
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>

      {/* เมนู Sidebar */}
      <div className="flex flex-col space-y-1">
        <SidebarItem
          to="/main-admin"
          icon={<Home size={24} />}
          text="หน้าหลัก"
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/list-activity-admin"
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
          to="/evaluation"
          icon={<ClipboardList size={24} />}
          text="แบบประเมิน (ห้าม click)"
          onClick={handleNotInThisSprint}
          collapsed={isCollapsed}
        />
        <SidebarItem
          to="/students"
          icon={<Users size={24} />}
          text="รายชื่อนิสิต (ห้าม click)"
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
        <div className="mt-70">
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

export default sidebar_admin;
