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

import { MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
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
  disabled?: boolean;
  seatCapacity?: string;
  setSeatCapacity?: (value: string) => void;
}

const RoomSelectionSection: React.FC<Props> = ({
  formData,
  selectedFloor,
  selectedRoom,
  rooms,
  handleFloorChange,
  handleRoomChange,
  handleChange,
  disabled = false,
  seatCapacity,
  setSeatCapacity,
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
          disabled={disabled}
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
          <MenuItem value="Soft">
            ชั่วโมงเตรียมความพร้อม (Soft Skill)
          </MenuItem>
          <MenuItem value="Hard">
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
            disabled={disabled || formData.event_format !== "Onsite"}
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
            disabled={disabled || formData.event_format !== "Onsite" || !selectedFloor}
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

      {/* จำนวนที่นั่ง - แสดงสำหรับ Online และ Course
      <div className="w-140">
        <label className="block font-semibold">จำนวนที่นั่ง</label>
        <TextField
          type="number"
          name="seat"
          value={seatCapacity || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              const num = Number(value);
              
              // ✅ ตรวจสอบตาม event_format
              if (formData.event_format === "Onsite") {
                // ✅ Onsite: ไม่เกินความจุห้อง (ถ้ามีห้องที่เลือก)
                const selectedRoomObj = filteredRooms.find(r => r.room_name === selectedRoom);
                const maxSeat = selectedRoomObj?.seat_number || 0;
                if (num >= 0 && num <= maxSeat) {
                  if (setSeatCapacity) {
                    setSeatCapacity(value);
                  }
                  const seatEvent = {
                    ...e,
                    target: {
                      ...e.target,
                      name: "seat",
                      value: value
                    }
                  };
                  handleChange(seatEvent);
                }
              } else if (formData.event_format === "Online") {
                // ✅ Online: ไม่จำกัด (แต่ต้องมากกว่า 0)
                if (num >= 0) {
                  if (setSeatCapacity) {
                    setSeatCapacity(value);
                  }
                  const seatEvent = {
                    ...e,
                    target: {
                      ...e.target,
                      name: "seat",
                      value: value
                    }
                  };
                  handleChange(seatEvent);
                }
              }
              // ✅ Course: ไม่สามารถกำหนดได้ (disabled)
            }
          }}
          disabled={disabled || formData.event_format === "Course"}
          className="w-full"
          placeholder={
            formData.event_format === "Course" 
              ? "ไม่สามารถกำหนดได้สำหรับ Course" 
              : formData.event_format === "Online"
              ? "กรอกจำนวนที่นั่ง (ไม่จำกัด)"
              : "กรอกจำนวนที่นั่ง"
          }
          sx={{
            "& .MuiInputBase-root": {
              height: "56px",
            },
            opacity: formData.event_format === "Course" ? 0.5 : 1,
          }}
          helperText={
            formData.event_format === "Course" 
              ? "Course ไม่ต้องการจำนวนที่นั่ง" 
              : formData.event_format === "Online"
              ? "กำหนดจำนวนที่นั่งสำหรับกิจกรรม Online (ไม่จำกัด)"
              : "จำนวนที่นั่งจะถูกกำหนดโดยห้องที่เลือก"
          }
        />s
      </div> */}
    </div>
  );
};

export default RoomSelectionSection;
