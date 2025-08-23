import { Select, MenuItem } from "@mui/material";
import { Frown } from "lucide-react";

interface Props {
  activity: {
    event_format?: string;
    activityFood?: Array<{ activity_food_id: number; activity_id: number; food_id: number }>;
  };
  selectedFood: string;
  setSelectedFood: React.Dispatch<React.SetStateAction<string>>;
  isEnrolled: boolean;
}

export default function FoodSelector({
  activity,
  selectedFood,
  setSelectedFood,
  isEnrolled,
}: Props) {
  return (
    <div className="mt-4">
      <p className="font-semibold font-[Sarabun]">อาหาร</p>
      {activity.event_format !== "Onsite" ||
      !Array.isArray(activity.activityFood) ||
      activity.activityFood.length == 0 ? (
        <p className="text-gray-500 mt-1 flex items-center">
          ไม่มีอาหารสำหรับกิจกรรมนี้ <Frown className="ml-3" />
        </p>
      ) : (
        <Select
          className="w-[40%] mt-1"
          value={selectedFood || ""} // แสดงค่า selectedFood ที่เลือก
          onChange={(e) => setSelectedFood(e.target.value)} // เมื่อเลือกอาหาร, จะอัปเดต selectedFood
          displayEmpty
          required
          disabled={isEnrolled} // ปิดการเลือกถ้านิสิตลงทะเบียนแล้ว
        >
          <MenuItem value="" disabled>
            เลือกเมนูอาหาร
          </MenuItem>
          {activity.activityFood?.map((foodItem, index: number) => (
            <MenuItem key={index} value={foodItem.food_id.toString()}>
              Food ID: {foodItem.food_id}
            </MenuItem>
          ))}
        </Select>
      )}
    </div>
  );
}
