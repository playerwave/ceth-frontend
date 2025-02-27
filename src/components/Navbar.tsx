import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar/sidebar_admin";

const Navbar = ({ children }) => {
  return (
    <div className="flex">
      {/* Navbar (ติดขอบบน) */}
      <div className="fixed top-0 left-0 w-full bg-[#1E3A8A] text-white h-80px p-4 z-50">
        <h2>BUU</h2>
      </div>

      {/* Sidebar (ติดขอบซ้าย) */}
      <div className="fixed top-[56px] left-0 w-[280px] h-[calc(100vh-56px)] ">
        <Sidebar />
      </div>

      {/* Content (เว้นที่ให้ Sidebar) */}
      <div className="ml-[100px] mt-[56px] w-full p-4 flex justify-center items-center min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Navbar;
