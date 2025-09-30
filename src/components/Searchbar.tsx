import React, { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}

const Searchbar: React.FC<SearchBarProps> = ({ onSearch, value, onChange }) => {
  console.log("🔁 Searchbar mounted");

  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  
  // ✅ ใช้ external value ถ้ามี หรือใช้ internal state
  const searchTerm = value !== undefined ? value : internalSearchTerm;

const handleSearch = () => {
  const trimmed = searchTerm.trim();
  onSearch(trimmed); // ✅ ส่งค่าไปเสมอ (ว่างหรือไม่ว่าง)
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newValue = e.target.value;
  if (onChange) {
    onChange(newValue); // ✅ ส่งค่าไปยัง parent
  } else {
    setInternalSearchTerm(newValue); // ✅ ใช้ internal state ถ้าไม่มี onChange
  }
};



  // ✅ รองรับการกด Enter เพื่อค้นหา
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
    data-cy="searchbar"
      className="flex items-center bg-white rounded-full 
    shadow-2xl shadow-gray-400 drop-shadow-lg 
    hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 
    w-full max-w-[300px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] 
    px-3 md:px-4 py-2"
    >
      {/* Input ค้นหา */}
      {/* <input
        type="text"
        placeholder="Search ..."
        className="flex-1 bg-transparent outline-none text-gray-600 placeholder-gray-400 px-2 text-sm md:text-base"
        value={searchTerm}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearchTerm(e.target.value)} // ✅ แค่เก็บค่า ไม่ต้องค้นหา
      /> */}


<input
type="text"
placeholder="Search ..."
className="flex-1 bg-transparent outline-none text-gray-600 placeholder-gray-400 px-2 text-sm md:text-base"
 value={searchTerm}
  onChange={handleInputChange}
  onKeyDown={handleKeyDown}
/>

      {/* ปุ่มค้นหา */}
      <button
        className="bg-[#1E3A8A] text-white p-2 rounded-full flex items-center justify-center 
        w-8 h-8 md:w-10 md:h-10 hover:bg-blue-900 transition-colors duration-200"
        onClick={handleSearch} // ✅ ค้นหาเมื่อคลิกปุ่ม
      >
        <Search size={16} className="md:w-5 md:h-5" />
      </button>
    </div>
  );
};

export default Searchbar;
