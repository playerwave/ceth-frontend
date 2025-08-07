import React from "react";
import { Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FloorDropdown from "./floordropdown";
import Button from "../../../../../components/Button";

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
    <div className="flex justify-end items-center gap-4 mt-7 relative z-10">
      <FloorDropdown
        floors={floors}
        floorFilter={floorFilter}
        setFloorFilter={setFloorFilter}
      />
      <Button
        onClick={() => navigate("/create-room-teacher")}
        className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-800 text-white rounded-lg hover:bg-blue-900 min-w-[100px] font-medium"
      >
        เพิ่มห้อง
        <Landmark size={18} />
      </Button>

    </div>
  );
};

export default RoomToolbar;
