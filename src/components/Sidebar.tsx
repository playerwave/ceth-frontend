//import react
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

//import dependecies
import {toast} from "sonner";
import {
  Home,
  BookA,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Utensils,
  School,
  BadgeCheck,
  Users,
  History
} from "lucide-react";

//import store
import { useAuthStore } from "../stores/Visitor/auth.store";
import { useNavigate } from "react-router-dom";

//import route
import { activityRoutes } from "../routes/activity.route";
import {foodRoutes} from "../routes/food.route"
import { roomRoutes } from "../routes/room.route";
import {activityHistoryRoutes} from "../routes/activity-history.route"
import {assessmentRoutes} from "../routes/assessment.route"
import {userRoutes} from "../routes/user.route"
import {certificateRoutes} from "../routes/certificate.route"

//import Components
import Dialog2 from "./Dialog/Dialog2";


interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  role: "Teacher" | "Student" | "Admin" | "Visitor";
}

const Sidebar = ({ isCollapsed, toggleSidebar, role }: SidebarProps) => {

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
const navigate = useNavigate();

const handleLogout = async () => {
  console.log("👉 Logout clicked"); // ✅ ตรวจว่า onClick ทำงาน

  try {
    await useAuthStore.getState().logout();
    toast.success("ออกจากระบบสำเร็จ");
    navigate("/activity-list-visitor");
  } catch (error) {
    toast.error("ออกจากระบบไม่สำเร็จ");
    console.error("Logout error:", error);
  }
};

const iconMap: { [key: string]: JSX.Element } = {
  BookA: <BookA size={24} />,
  ClipboardList: <ClipboardList size={24} />,
  Utensils: <Utensils size={24} />,
  School: <School size={24} />,
  BadgeCheck: <BadgeCheck size={24} />,
  Users: <Users size={24}/>,
  History: <History size={24}/>
};

  const buildSidebarItems = (
  routes: any[],
  role: string,
  iconMap: { [key: string]: JSX.Element }
) => {
  return routes
    .filter(route => route && route.visibleInSidebar && route.roles.includes(role))
    .map(route => ({
      to: route.path,
      text: route.label,
      icon: iconMap[route.icon],
      isActionable: true
    }));
};

const activitySidebarItems = buildSidebarItems(activityRoutes, role, iconMap);
const activityHistorySidebarItems = buildSidebarItems(activityHistoryRoutes, role, iconMap);
const assessmentSidebarItems = buildSidebarItems(assessmentRoutes, role, iconMap);
const userSidebarItems = buildSidebarItems(userRoutes, role, iconMap);
const certificateSidebarItems = buildSidebarItems(certificateRoutes, role, iconMap);
const foodSidebarItems = buildSidebarItems(foodRoutes, role, iconMap);
const roomSidebarItems = buildSidebarItems(roomRoutes, role, iconMap);




  const items = [
  {
    to: role === "Teacher" ? "/" : "/main-student",
    icon: <Home size={24} />,
    text: "หน้าหลัก",
    isActionable: true
  },
  ...activitySidebarItems,
  ...activityHistorySidebarItems,
  ...assessmentSidebarItems,
  ...userSidebarItems,
  ...certificateSidebarItems,
  ...foodSidebarItems,
  ...roomSidebarItems,
   {
    to: "", // หรือ "#" ก็ได้ เพราะใช้ onClick เป็นหลัก
    icon: <LogOut size={24} />,
    text: "ออกจากระบบ",
    onClick: () => setShowLogoutDialog(true), // 💡 เปิด Dialog2
    isActionable: true
  }
];

const filteredItems = role === "Student"
  ? items.filter(item =>
      !["/foods", "/evaluation", "/students","/rooms"].includes(item.to)
    )
  : items;

    
  return (
    <div
      className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] z-50 bg-gray-100 text-gray-900 transition-all duration-300 font-pt ${
        isCollapsed ? "w-20 shadow-lg" : "w-72 shadow-2xl"
      }`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* ปุ่มย่อ/ขยาย Sidebar */}
        <div className="flex justify-between items-center mb-4">
          <span
            className={`text-lg font-semibold text-gray-600 transition-all duration-300 ${
              isCollapsed
                ? "opacity-0 w-0 overflow-hidden"
                : "opacity-100 w-auto"
            }`}
          >
            Panel
          </span>

          <button
            onClick={toggleSidebar}
            data-cy="toggle-sidebar"
            className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-200 transition hidden md:inline-flex"
          >
            {isCollapsed ? (
              <ChevronRight size={24} />
            ) : (
              <ChevronLeft size={24} />
            )}
          </button>
        </div>

        {/* เมนู Sidebar */}
        {/* <div className="flex flex-col space-y-1">
          {filteredItems.map((item, index) => (
            <SidebarItem key={index} {...item} collapsed={isCollapsed} />
          ))}
        </div> */}

        <div className="flex flex-col justify-between h-full">
  {/* 🔹 เมนูหลัก */}
  <div className="space-y-1">
    {filteredItems
      .filter(item => item.text !== "ออกจากระบบ")
      .map((item, index) => (
        <SidebarItem key={index} {...item} collapsed={isCollapsed} />
      ))}
  </div>

  {/* 🔻 ปุ่มออกจากระบบ */}
  <div className="pb-50 border-t border-gray-200">
    {filteredItems
      .filter(item => item.text === "ออกจากระบบ")
      .map((item, index) => (
        <SidebarItem key={`logout-${index}`} {...item} collapsed={isCollapsed}data-cy="sidebar-logout-button" />
      ))}
  </div>
</div>

      </div>
      <Dialog2
        open={showLogoutDialog}
        title="คุณแน่ใจหรือไม่?"
        message="คุณต้องการออกจากระบบจริงหรือ?"
        icon={<LogOut size={32} className="text-blue-600" />}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={() => {
          setShowLogoutDialog(false);
          handleLogout();
        }}
        type="button"
      />
    </div>
  );
};

const SidebarItem = ({
  to,
  icon,
  text,
  onClick,
  collapsed,
  isActionable,
}: {
  to: string;
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  collapsed: boolean;
    isActionable?: boolean;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const isRouteItem = typeof onClick !== "function";
  const isDisabled = !isActionable;

  const baseClass = `relative flex items-center py-2 px-3 rounded-lg transition-all duration-300 font-pt ${
    isActive
      ? "bg-blue-100 text-blue-600 border-l-4 border-blue-500 shadow-md"
      : isDisabled
        ? "text-gray-400 cursor-not-allowed bg-gray-50"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  } ${collapsed ? "justify-center" : ""}`;

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

const disabledClass = `relative flex items-center py-2 px-3 rounded-lg font-pt
  text-gray-400 cursor-not-allowed bg-gray-50 
  ${collapsed ? "justify-center" : ""}`;

const dataCy = `sidebar-${text.toLowerCase().replace(/\s+/g, "-")}`;

return isRouteItem ? (
  <Link to={to} className={isDisabled ? disabledClass : baseClass} data-cy={dataCy}>
    
    {content}
  </Link>
) : (
  <div onClick={isDisabled ? undefined : onClick} className={isDisabled ? disabledClass : baseClass} data-cy={dataCy}>
    {content}
  </div>
);


};

export default Sidebar;

