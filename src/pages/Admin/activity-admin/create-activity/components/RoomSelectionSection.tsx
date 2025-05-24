// components/AdminActivityForm/RoomSelectionSection.tsx
import { MenuItem, Select } from "@mui/material";

interface Props {
  formData: any;
  selectedFloor: string;
  selectedRoom: string;
  IfBuildingRoom: Record<string, { name: string; capacity: number }[]>;
  handleFloorChange: (event: any) => void;
  handleRoomChange: (event: any) => void;
}

const RoomSelectionSection: React.FC<Props> = ({
  formData,
  selectedFloor,
  selectedRoom,
  IfBuildingRoom,
  handleFloorChange,
  handleRoomChange,
}) => {
  return (
    <div className="flex space-x-4 mt-5">
      {/* เลือกชั้น */}
      <div className="w-1/6">
        <label className="block font-semibold">เลือกชั้น</label>
        <Select
          labelId="floor-select-label"
          value={selectedFloor}
          onChange={handleFloorChange}
          className="rounded p-2 w-full"
          disabled={formData.ac_location_type !== "Onsite"}
          sx={{
            height: "56px",
            "& .MuiSelect-select": { padding: "8px" },
          }}
        >
          <MenuItem value="">เลือกชั้น</MenuItem>
          {Object.keys(IfBuildingRoom).map((floor) => (
            <MenuItem key={floor} value={floor}>
              {floor}
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* เลือกห้อง */}
      <div className="w-85.5">
        <label className="block font-semibold">เลือกห้อง</label>
        <Select
          labelId="room-select-label"
          value={selectedRoom}
          onChange={handleRoomChange}
          className={`rounded p-2 w-full ${
            !selectedFloor || formData.ac_location_type !== "Onsite"
              ? "cursor-not-allowed"
              : ""
          }`}
          disabled={formData.ac_location_type !== "Onsite" || !selectedFloor}
          sx={{
            height: "56px",
            "& .MuiSelect-select": { padding: "8px" },
          }}
        >
          <MenuItem value="">เลือกห้อง</MenuItem>
          {selectedFloor &&
            IfBuildingRoom[selectedFloor]?.map((room) => (
              <MenuItem key={room.name} value={room.name}>
                {room.name} (ความจุ {room.capacity} ที่นั่ง)
              </MenuItem>
            ))}
        </Select>
      </div>
    </div>
  );
};

export default RoomSelectionSection;
