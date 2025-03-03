import React from "react";
import { Search } from "lucide-react";

const Searchbar: React.FC = () => {
  return (
    <div
      className="flex items-center bg-white rounded-full 
    shadow-2xl shadow-gray-400 drop-shadow-lg 
    hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 w-[900px] px-4 py-2"
    >
      {/* Input ค้นหา */}
      <input
        type="text"
        placeholder="Search ..."
        className="flex-1 bg-transparent outline-none text-gray-600 placeholder-gray-400 px-2"
      />

      {/* ปุ่มค้นหา */}
      <button className="bg-[#1E3A8A] text-white p-2 rounded-full flex items-center justify-center w-10 h-10">
        <Search size={20} />
      </button>
    </div>
  );
};

export default Searchbar;
