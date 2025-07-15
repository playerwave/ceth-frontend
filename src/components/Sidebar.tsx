// import { Link, useLocation } from "react-router-dom";
// import {
//   Home,
//   BookA,
//   History,
//   ClipboardList,
//   Users,
//   BadgeCheck,
//   Settings,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   StickyNote,
// } from "lucide-react";

// interface SidebarProps {
//   isCollapsed: boolean;
//   toggleSidebar: () => void;
//   role: "admin" | "student";
// }

// const Sidebar = ({ isCollapsed, toggleSidebar, role }: SidebarProps) => {
//   const handleNotInThisSprint = () => {
//     alert("Use Case นี้จะถูกพัฒนาใน Sprint อื่นๆ ขออภัยในความไม่สะดวก");
//   };

//   const commonItems = [
//     {
//       to: role === "admin" ? "/" : "/visiter",
//       icon: <StickyNote size={24} />,
//       text: "หน้าเยี่ยมชม",
//     },
//     {
//       to: role === "admin" ? "/" : "/main-student",
//       icon: <Home size={24} />,
//       text: "หน้าหลัก",
//     },
//     {
//       to: role === "admin" ? "/list-activity-admin" : "/list-activity-student",
//       icon: <BookA size={24} />,
//       text: "กิจกรรมสหกิจ",
//     },
//     {
//       to: "/history",
//       icon: <History size={24} />,
//       text: "ประวัติกิจกรรม (ห้าม click)",
//       onClick: handleNotInThisSprint,
//     },
//     {
//       to: "/certificates",
//       icon: <BadgeCheck size={24} />,
//       text: "จัดการเกียรติบัตร (ห้าม click)",
//       onClick: handleNotInThisSprint,
//     },
//     {
//       to: "/settings",
//       icon: <Settings size={24} />,
//       text: "ตั้งค่า (ห้าม click)",
//       onClick: handleNotInThisSprint,
//     },
//     {
//       to: "/logout",
//       icon: <LogOut size={24} />,
//       text: "ออกจากระบบ (ห้าม click)",
//       onClick: handleNotInThisSprint,
//     },
//   ];

//   const adminOnlyItems = [
//     {
//       to: "/evaluation",
//       icon: <ClipboardList size={24} />,
//       text: "แบบประเมิน (ห้าม click)",
//       onClick: handleNotInThisSprint,
//     },
//     {
//       to: "/students",
//       icon: <Users size={24} />,
//       text: "รายชื่อนิสิต (ห้าม click)",
//       onClick: handleNotInThisSprint,
//     },
//   ];

//   const itemsToRender =
//     role === "admin"
//       ? [...commonItems.slice(0, 2), ...adminOnlyItems, ...commonItems.slice(2)]
//       : commonItems;

//   return (
//     <div
//       className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] z-50 bg-gray-100 text-gray-900 transition-all duration-300 ${
//         isCollapsed ? "w-20 shadow-lg" : "w-72 shadow-2xl"
//       }`}
//     >
//       <div className="p-4 flex flex-col h-full">
//         {/* ปุ่มย่อ/ขยาย Sidebar */}
//         <div className="flex justify-between items-center mb-4">
//           <span
//             className={`font-pt font-bbold text-lg font-semibold text-gray-600 transition-all duration-300 ${
//               isCollapsed
//                 ? "opacity-0 w-0 overflow-hidden"
//                 : "opacity-100 w-auto"
//             }`}
//           >
//             Panel
//           </span>

//           <button
//             onClick={toggleSidebar}
//             className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-200 transition hidden md:inline-flex"
//           >
//             {isCollapsed ? (
//               <ChevronRight size={24} />
//             ) : (
//               <ChevronLeft size={24} />
//             )}
//           </button>
//         </div>

//         {/* เมนู Sidebar */}
//         <div className="flex flex-col space-y-1">
//           {itemsToRender.map((item, index) => (
//             <SidebarItem key={index} {...item} collapsed={isCollapsed} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const SidebarItem = ({
//   to,
//   icon,
//   text,
//   onClick,
//   collapsed,
// }: {
//   to: string;
//   icon: React.ReactNode;
//   text: string;
//   onClick?: () => void;
//   collapsed: boolean;
// }) => {
//   const location = useLocation();
//   const isActive = location.pathname === to;
//   const isDisabled = typeof onClick === "function";

//   const baseClass = `relative flex items-center py-2 px-3 rounded-lg transition-all duration-300 ${
//     isActive
//       ? "bg-blue-100 text-blue-600 border-l-4 border-blue-500 shadow-md"
//       : isDisabled
//         ? "text-gray-400 cursor-not-allowed bg-gray-50"
//         : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//   } ${collapsed ? "justify-center" : ""}`;

//   const content = (
//     <>
//       <span className="flex-shrink-0">{icon}</span>
//       <span
//         className={`transition-all duration-300 whitespace-nowrap ${
//           collapsed
//             ? "opacity-0 w-0 overflow-hidden"
//             : "opacity-100 w-auto ml-3"
//         }`}
//       >
//         {text}
//       </span>
//     </>
//   );

//   return isDisabled ? (
//     <div onClick={onClick} className={baseClass}>
//       {content}
//     </div>
//   ) : (
//     <Link to={to} className={baseClass}>
//       {content}
//     </Link>
//   );
// };

// export default Sidebar;

import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookA,
  History,
  ClipboardList,
  Users,
  BadgeCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  StickyNote,
} from "lucide-react";
import { useAuthStore } from "../stores/Visitor/auth.store";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  role: "admin" | "student";
}

const Sidebar = ({ isCollapsed, toggleSidebar, role }: SidebarProps) => {
  const handleNotInThisSprint = () => {
    alert("Use Case นี้จะถูกพัฒนาใน Sprint อื่นๆ ขออภัยในความไม่สะดวก");
  };

  
const navigate = useNavigate();

//   const handleLogout = async () => {
//   try {
//     await useAuthStore.getState().logout(); // ✅ เรียกที่เดียวจบ
//     toast.success("ออกจากระบบสำเร็จ");
//     navigate("/login");
//   } catch (error) {
//     toast.error("ออกจากระบบไม่สำเร็จ");
//     console.error("Logout error:", error);
//   }
// };

const handleLogout = async () => {
  console.log("👉 Logout clicked"); // ✅ ตรวจว่า onClick ทำงาน

  try {
    await useAuthStore.getState().logout();
    toast.success("ออกจากระบบสำเร็จ");
    navigate("/login");
  } catch (error) {
    toast.error("ออกจากระบบไม่สำเร็จ");
    console.error("Logout error:", error);
  }
};

  // const commonItems = [
  //   {
  //     to:"/visiter",
  //     icon: <StickyNote size={24} />,
  //     text: "หน้าเยี่ยมชม",
  //     isActionable: false
  //   },
  //   {
  //     to: role === "admin" ? "/" : "/main-student",
  //     icon: <Home size={24} />,
  //     text: "หน้าหลัก",
  //     isActionable: true
  //   },
  //   {
  //     to: role === "admin" ? "/list-activity-admin" : "/list-activity-student",
  //     icon: <BookA size={24} />,
  //     text: "กิจกรรมสหกิจ",
  //     isActionable: true
  //   },
  //   {
  //     to: "/history",
  //     icon: <History size={24} />,
  //     text: "ประวัติกิจกรรม (ห้าม click)",
  //     onClick: handleNotInThisSprint,
  //     isActionable: false
  //   },
  //   {
  //     to: "/certificates",
  //     icon: <BadgeCheck size={24} />,
  //     text: "จัดการเกียรติบัตร (ห้าม click)",
  //     onClick: handleNotInThisSprint,
  //     isActionable: false
  //   },
  //   {
  //     to: "/settings",
  //     icon: <Settings size={24} />,
  //     text: "ตั้งค่า (ห้าม click)",
  //     onClick: handleNotInThisSprint,
  //    isActionable: false
  //   },
  //   {
  //     to: "",
  //     icon: <LogOut size={24} />,
  //     text: "ออกจากระบบ",
  //     onClick: handleLogout,
  //     isActionable: true
  //   },
  // ];

  // const adminOnlyItems = [
  //   {
  //     to: "/evaluation",
  //     icon: <ClipboardList size={24} />,
  //     text: "แบบประเมิน (ห้าม click)",
  //     onClick: handleNotInThisSprint,
  //     isActionable: false
  //   },
  //   {
  //     to: "/students",
  //     icon: <Users size={24} />,
  //     text: "รายชื่อนิสิต (ห้าม click)",
  //     onClick: handleNotInThisSprint,
  //     isActionable: false
  //   },
  // ];

  // const itemsToRender =
  //   role === "admin"
  //     ? [...commonItems.slice(0, 2), ...adminOnlyItems, ...commonItems.slice(2)]
  //     : commonItems;

  const itemsToRender = [
  {
    to: "/activity-list-visitor",
    icon: <StickyNote size={24} />,
    text: "หน้าเยี่ยมชม",
    isActionable: true
  },
  {
    to: role === "admin" ? "/" : "/main-student",
    icon: <Home size={24} />,
    text: "หน้าหลัก",
    isActionable: true
  },
  {
      to: role === "admin" ? "/list-activity-admin" : "/list-activity-student",
      icon: <BookA size={24} />,
      text: "กิจกรรมสหกิจ",
      isActionable: true
  },
  {
    to: "/history",
    icon: <History size={24} />,
    text: "ประวัติกิจกรรม (ห้าม click)",
    onClick: handleNotInThisSprint,
    isActionable: false
  },
  {
    to: "/evaluation",
    icon: <ClipboardList size={24} />,
    text: "แบบประเมิน (ห้าม click)",
    onClick: handleNotInThisSprint,
    isActionable: false
  },
  {
    to: "/students",
    icon: <Users size={24} />,
    text: "รายชื่อนิสิต (ห้าม click)",
    onClick: handleNotInThisSprint,
    isActionable: false
  },
  {
    to: "/certificates",
    icon: <BadgeCheck size={24} />,
    text: "จัดการเกียรติบัตร (ห้าม click)",
    onClick: handleNotInThisSprint,
    isActionable: false
  },
  {
    to: "/settings",
    icon: <Settings size={24} />,
    text: "ตั้งค่า (ห้าม click)",
    onClick: handleNotInThisSprint,
    isActionable: false
  },
  {
    to: "",
    icon: <LogOut size={24} />,
    text: "ออกจากระบบ",
    onClick: handleLogout,
    isActionable: true
  },
];

    
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
        <div className="flex flex-col space-y-1">
          {itemsToRender.map((item, index) => (
            <SidebarItem key={index} {...item} collapsed={isCollapsed} />
          ))}
        </div>
      </div>
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

  // return isDisabled ? (
  //   <div onClick={onClick} className={baseClass}>
  //     {content}
  //   </div>
  // ) : (
  //   <Link to={to} className={baseClass}>
  //     {content}
  //   </Link>
  // );
const disabledClass = `relative flex items-center py-2 px-3 rounded-lg font-pt
  text-gray-400 cursor-not-allowed bg-gray-50 
  ${collapsed ? "justify-center" : ""}`;


return isRouteItem ? (
  <Link to={to} className={isDisabled ? disabledClass : baseClass}>
    {content}
  </Link>
) : (
  <div onClick={isDisabled ? undefined : onClick} className={isDisabled ? disabledClass : baseClass}>
    {content}
  </div>
);


};

export default Sidebar;

