// // components/AdminActivityForm/RoomSelectionSection.tsx
// import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

// import { CreateActivityForm } from "../create_activity_admin";

// interface Props {
//   formData: CreateActivityForm;
//   selectedFloor: string;
//   selectedRoom: string;
//    rooms: Room[];
//   handleFloorChange: (event: any) => void;
//   handleRoomChange: (event: any) => void;
//   handleChange: (e: React.ChangeEvent<any> | SelectChangeEvent) => void;
// }

// const RoomSelectionSection: React.FC<Props> = ({
//   formData,
//   selectedFloor,
//   selectedRoom,
//   rooms,
//   handleFloorChange,
//   handleRoomChange,
//   handleChange,
// }) => {
//   return (

//     <div className="flex flex-col space-y-4 mt-5">
//   {/* ประเภทกิจกรรม */}
//   <div className="w-140">
//     <label className="block font-semibold">ประเภท *</label>
//     <Select
//       labelId="type-label"
//       name="type"
//       value={formData.type}
//       onChange={handleChange}
//       className="rounded w-full"
//       displayEmpty
//       renderValue={(selected) => {
//         if (!selected) {
//           return <span className="text-black">เลือกประเภทกิจกรรม</span>;
//         }
//         return selected;
//       }}
//       sx={{
//         height: "56px",
//         "& .MuiSelect-select": {
//           padding: "8px",
//         },
//       }}
//     >
//       <MenuItem disabled value="">เลือกประเภทกิจกรรม</MenuItem>
//       <MenuItem value="Soft Skill">ชั่วโมงเตรียมความพร้อม (Soft Skill)</MenuItem>
//       <MenuItem value="Hard Skill">ชั่วโมงทักษะทางวิชาการ (Hard Skill)</MenuItem>
//     </Select>
//   </div>

//   {/* ชั้น + ห้อง: วางข้างกัน */}
//   <div className="flex space-x-6 w-140">
//     {/* เลือกชั้น */}
//     <div className="w-1/2">
//       <label className="block font-semibold">เลือกชั้น</label>

//       <Select
//   labelId="floor-select-label"
//   value={selectedFloor}
//   onChange={handleFloorChange}
//   className="rounded p-2 w-full"
//   disabled={formData.event_format !== "Onsite"} // ✅ กดไม่ได้ถ้าไม่ใช่ Onsite
//   sx={{
//   height: "56px",
//   opacity: formData.event_format !== "Onsite" ? 0.5 : 1,
//   "& .MuiSelect-select": { padding: "8px" },
// }}

// >
//   <MenuItem value="">เลือกชั้น</MenuItem>
//   {Object.keys(IfBuildingRoom).map((floor) => (
//     <MenuItem key={floor} value={floor}>
//       {floor}
//     </MenuItem>
//   ))}
// </Select>


//     </div>

//     {/* เลือกห้อง */}
//     <div className="w-1/2">
//       <label className="block font-semibold">เลือกห้อง</label>
//       <Select
//         labelId="room-select-label"
//         value={selectedRoom}
//         onChange={handleRoomChange}
//         className={`rounded p-2 w-full ${
//           !selectedFloor || formData.event_format !== "Onsite"
//             ? "cursor-not-allowed"
//             : ""
//         }`}
//         disabled={formData.event_format !== "Onsite" || !selectedFloor}
//         sx={{
//           height: "56px",
//           "& .MuiSelect-select": { padding: "8px" },
//         }}
//       >
//         <MenuItem value="">เลือกห้อง</MenuItem>
//         {selectedFloor &&
//           IfBuildingRoom[selectedFloor]?.map((room) => (
//             <MenuItem key={room.name} value={room.name}>
//               {room.name} (ความจุ {room.capacity} ที่นั่ง)
//             </MenuItem>
//           ))}
//       </Select>
//     </div>
//   </div>
// </div>


//   );
// };

// export default RoomSelectionSection;

import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { CreateActivityForm } from "../create_activity_admin";
import { Room } from "../../../../../types/model"; // ✅ ปรับ path ให้ตรงกับที่เก็บ Room

interface Props {
  formData: CreateActivityForm;
  selectedFloor: string;
  selectedRoom: string;
  rooms: Room[];
  handleFloorChange: (event: SelectChangeEvent) => void;
  handleRoomChange: (event: SelectChangeEvent) => void;
  handleChange: (e: React.ChangeEvent<any> | SelectChangeEvent) => void;
}

const RoomSelectionSection: React.FC<Props> = ({
  formData,
  selectedFloor,
  selectedRoom,
  rooms,
  handleFloorChange,
  handleRoomChange,
  handleChange,
}) => {
  // ✅ สร้างรายการชั้นจาก rooms
  const uniqueFloors = Array.from(new Set(rooms.map((r) => r.floor))).sort();

  // ✅ กรองห้องตามชั้นที่เลือก
  const filteredRooms = rooms.filter((r) => r.floor === selectedFloor);

  return (
    <div className="flex flex-col space-y-4 mt-5">
      {/* ประเภทกิจกรรม */}
      <div className="w-140">
        <label className="block font-semibold">ประเภท *</label>
        <Select
          labelId="type-label"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="rounded w-full"
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return <span className="text-black">เลือกประเภทกิจกรรม</span>;
            }
            return selected;
          }}
          sx={{
            height: "56px",
            "& .MuiSelect-select": {
              padding: "8px",
            },
          }}
        >
          <MenuItem disabled value="">
            เลือกประเภทกิจกรรม
          </MenuItem>
          <MenuItem value="Soft Skill">
            ชั่วโมงเตรียมความพร้อม (Soft Skill)
          </MenuItem>
          <MenuItem value="Hard Skill">
            ชั่วโมงทักษะทางวิชาการ (Hard Skill)
          </MenuItem>
        </Select>
      </div>

      {/* ชั้น + ห้อง: วางข้างกัน */}
      <div className="flex space-x-6 w-140">
        {/* เลือกชั้น */}
        <div className="w-1/2">
          <label className="block font-semibold">เลือกชั้น</label>
          <Select
            labelId="floor-select-label"
            value={selectedFloor}
            onChange={handleFloorChange}
            className="rounded p-2 w-full"
            disabled={formData.event_format !== "Onsite"}
            sx={{
              height: "56px",
              opacity: formData.event_format !== "Onsite" ? 0.5 : 1,
              "& .MuiSelect-select": { padding: "8px" },
            }}
          >
            <MenuItem value="">เลือกชั้น</MenuItem>
            {uniqueFloors.map((floor) => (
              <MenuItem key={floor} value={floor}>
                {floor}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* เลือกห้อง */}
        <div className="w-1/2">
          <label className="block font-semibold">เลือกห้อง</label>
          <Select
            labelId="room-select-label"
            value={selectedRoom}
            onChange={handleRoomChange}
            className={`rounded p-2 w-full ${
              !selectedFloor || formData.event_format !== "Onsite"
                ? "cursor-not-allowed"
                : ""
            }`}
            disabled={formData.event_format !== "Onsite" || !selectedFloor}
            sx={{
              height: "56px",
              "& .MuiSelect-select": { padding: "8px" },
            }}
          >
            <MenuItem value="">เลือกห้อง</MenuItem>
            {filteredRooms.map((room) => (
              <MenuItem key={room.room_id} value={room.room_name}>
                {room.room_name} (ความจุ {room.seat_number} ที่นั่ง)
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default RoomSelectionSection;
