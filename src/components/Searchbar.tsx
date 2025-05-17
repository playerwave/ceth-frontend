import React, { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const Searchbar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ ค้นหาเมื่อกด Enter หรือเมื่อปุ่มค้นหาถูกกด
  const handleSearch = () => {
    onSearch(searchTerm.trim()); // ✅ ค้นหาเฉพาะเมื่อกดปุ่มหรือ Enter
  };

  // ✅ รองรับการกด Enter เพื่อค้นหา
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

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
        value={searchTerm}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearchTerm(e.target.value)} // ✅ แค่เก็บค่า ไม่ต้องค้นหา
      />

      {/* ปุ่มค้นหา */}
      <button
        className="bg-[#1E3A8A] text-white p-2 rounded-full flex items-center justify-center w-10 h-10"
        onClick={handleSearch} // ✅ ค้นหาเมื่อคลิกปุ่ม
      >
        <Search size={20} />
      </button>
    </div>
  );
};

export default Searchbar;
