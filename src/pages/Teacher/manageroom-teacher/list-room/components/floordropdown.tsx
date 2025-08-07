import React from "react";
import { Building2, ChevronDown } from "lucide-react";
import Button from "../../../../../components/Button";

interface Props {
  floors: number[];
  floorFilter: number | "all";
  setFloorFilter: (val: number | "all") => void;
}

const FloorDropdown: React.FC<Props> = ({
  floors,
  floorFilter,
  setFloorFilter,
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <Button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-800 text-white rounded-lg hover:bg-blue-900 min-w-[100px]"
      >
        <span>ชั้น: {floorFilter === "all" ? "ทั้งหมด" : floorFilter}</span>
        <Building2 size={18} />
        <ChevronDown size={18} />
      </Button>


      {showDropdown && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 rounded shadow-md z-50">
          <button
            onClick={() => {
              setFloorFilter("all");
              setShowDropdown(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            ทั้งหมด
          </button>
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => {
                setFloorFilter(floor);
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              ชั้น {floor}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloorDropdown;
