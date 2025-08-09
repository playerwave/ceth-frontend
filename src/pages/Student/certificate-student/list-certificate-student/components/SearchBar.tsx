import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  debounceMs?: number; // ✅ เพิ่ม optional prop
}

const Searchbar: React.FC<SearchBarProps> = ({ onSearch, debounceMs = 300 }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ ค้นหาอัตโนมัติระหว่างพิมพ์ (debounce)
  useEffect(() => {
    const t = setTimeout(() => onSearch(searchTerm.trim()), debounceMs);
    return () => clearTimeout(t);
  }, [searchTerm, debounceMs, onSearch]);

  // ✅ ปุ่ม/Enter = ค้นหาทันที (ข้าม debounce)
  const handleSearchNow = () => onSearch(searchTerm.trim());
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearchNow();
  };

  return (
    <div
      className="flex items-center bg-white rounded-full 
      shadow-2xl shadow-gray-400 drop-shadow-lg 
      hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 
      w-full max-w-[300px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] 
      px-3 md:px-4 py-2"
    >
      <input
        type="text"
        placeholder="Search ..."
        className="flex-1 bg-transparent outline-none text-gray-600 placeholder-gray-400 px-2 text-sm md:text-base"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="bg-[#1E3A8A] text-white p-2 rounded-full flex items-center justify-center 
        w-8 h-8 md:w-10 md:h-10 hover:bg-blue-900 transition-colors duration-200"
        onClick={handleSearchNow}
      >
        <Search size={16} className="md:w-5 md:h-5" />
      </button>
    </div>
  );
};

export default Searchbar;