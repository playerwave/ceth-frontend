import React from "react";
import { Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FloorDropdown from "./floordropdown";

interface Props {
  floors: number[];
  floorFilter: number | "all";
  setFloorFilter: (val: number | "all") => void;
}

const RoomToolbar: React.FC<Props> = ({
  floors,
  floorFilter,
  setFloorFilter,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end items-center gap-4 mt-6 relative z-10">
      <FloorDropdown
        floors={floors}
        floorFilter={floorFilter}
        setFloorFilter={setFloorFilter}
      />
      <button
        onClick={() => navigate("/create-room")}
        className="px-4 py-2 bg-blue-800 text-white font-medium rounded-xl hover:bg-blue-900 flex gap-2 items-center"
      >
        เพิ่มห้อง
        <Landmark size={18} />
      </button>
    </div>
  );
};

export default RoomToolbar;
