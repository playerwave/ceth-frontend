import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ ค้นหาเมื่อกด Enter หรือเมื่อปุ่มค้นหาถูกกด
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      onSearch(""); // ✅ ค่าว่างให้โหลดข้อมูลทั้งหมด
    } else {
      onSearch(searchTerm);
    }
  };

  // ✅ รองรับการกด Enter เพื่อค้นหา
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative bg-white shadow p-3 rounded-lg mb-4 max-w-4xl mx-auto">
      <input
        type="text"
        placeholder="ค้นหากิจกรรม..."
        value={searchTerm}
        onKeyPress={handleKeyPress} // ✅ รองรับ Enter
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onSearch(e.target.value);
        }}
        className="w-full pl-3 pr-10 border rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <FontAwesomeIcon
        icon={faSearch}
        onClick={handleSearch}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-2xl"
        style={{ color: "#1E3A8A" }}
      />
    </div>
  );
};

export default SearchBar;
