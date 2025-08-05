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

import { MenuItem, Select, SelectChangeEvent, TextField, FormHelperText } from "@mui/material";
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
  // ✅ เพิ่ม props สำหรับ room conflicts
  roomConflicts?: any[];
  checkingAvailability?: boolean;
  hasTimeConflict?: boolean;
  currentActivityId?: number;
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
  roomConflicts = [],
  checkingAvailability = false,
  hasTimeConflict = false,
  currentActivityId,
}) => {
  // ✅ สร้างรายการชั้นจาก rooms
  const uniqueFloors = Array.from(new Set(rooms.map((r) => r.floor))).sort();

  // ✅ กรองห้องตามชั้นที่เลือก
  const filteredRooms = rooms.filter((r) => r.floor === selectedFloor);

  // ✅ ตรวจสอบว่าห้องไหนมี conflict
  const getRoomConflict = (roomId: number) => {
    return roomConflicts.find(conflict => conflict.room_id === roomId);
  };

  // ✅ ตรวจสอบว่ามีวันที่และเวลาที่กำหนดหรือไม่
  const hasDateTimeSet = formData.start_activity_date && formData.end_activity_date;

  // ✅ ตรวจสอบว่าห้องที่เลือกมี conflict หรือไม่
  const selectedRoomConflict = formData.room_id ? getRoomConflict(formData.room_id) : null;

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
            {filteredRooms.map((room) => {
              const conflict = getRoomConflict(room.room_id);
              const isCurrentActivity = currentActivityId && conflict?.activity_id === currentActivityId;
              const isAvailable = !conflict || isCurrentActivity;
              
              return (
                <MenuItem 
                  key={room.room_id} 
                  value={room.room_name}
                  disabled={Boolean(!isAvailable && hasDateTimeSet)}
                  sx={{
                    color: isAvailable ? 'inherit' : '#999',
                    backgroundColor: isAvailable ? 'inherit' : '#f5f5f5',
                  }}
                >
                  {room.room_name} (ความจุ {room.seat_number} ที่นั่ง)
                  {!isAvailable && hasDateTimeSet && (
                    <span className="text-red-500 ml-2">
                      - ถูกใช้งานแล้ว
                    </span>
                  )}
                </MenuItem>
              );
            })}
          </Select>
          
          {/* ✅ แสดง helper text สำหรับห้องที่เลือก */}
          {selectedRoomConflict && hasDateTimeSet && !checkingAvailability && (
            <FormHelperText 
              error={!currentActivityId || selectedRoomConflict.activity_id !== currentActivityId}
              sx={{ mt: 1 }}
            >
              {currentActivityId && selectedRoomConflict.activity_id === currentActivityId ? (
                "ห้องนี้ถูกใช้งานโดยกิจกรรมปัจจุบัน"
              ) : (
                `ห้องนี้ถูกใช้งานโดยกิจกรรม: ${selectedRoomConflict.activity_name || 'ไม่ระบุ'}`
              )}
            </FormHelperText>
          )}
          
          {/* ✅ แสดง helper text เมื่อกำลังตรวจสอบ */}
          {checkingAvailability && hasDateTimeSet && (
            <FormHelperText sx={{ mt: 1, color: 'info.main' }}>
              กำลังตรวจสอบห้องที่ว่าง...
            </FormHelperText>
          )}
          
          {/* ✅ แสดง helper text เมื่อยังไม่ได้เลือกวันที่ */}
          {!hasDateTimeSet && formData.event_format === "Onsite" && (
            <FormHelperText sx={{ mt: 1, color: 'text.secondary' }}>
              เลือกวันที่และเวลากิจกรรมเพื่อดูห้องที่ว่าง
            </FormHelperText>
          )}
        </div>
      </div>

      {/* ✅ แสดงข้อความแจ้งเตือนเมื่อมี time conflict */}
      {hasTimeConflict && hasDateTimeSet && (
        <div className="w-140 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800 text-sm font-medium">
              ⚠️ ห้องที่เลือกถูกใช้งานในช่วงเวลานี้ กรุณาเลือกห้องอื่นหรือเปลี่ยนเวลา
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSelectionSection;
