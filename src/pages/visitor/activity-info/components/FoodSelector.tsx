import { Select, MenuItem } from "@mui/material";
import { Frown } from "lucide-react";

interface Props {
  activity: any;
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
      {activity.location_type !== "Onsite" ||
      !Array.isArray(activity.food) ||
      activity.food.length == 0 ? (
        <p className="text-gray-500 mt-1 flex items-center text-sm sm:text-base md:text-lg">
          ไม่มีอาหารสำหรับกิจกรรมนี้ <Frown className="ml-3" />
        </p>
      ) : (
        <Select
          className="w-[40%] sm:w-[40%] md:w-[40%] xl:w-[40%] mt-2"
          value={selectedFood || ""} // แสดงค่า selectedFood ที่เลือก
          onChange={(e) => setSelectedFood(e.target.value)} // เมื่อเลือกอาหาร, จะอัปเดต selectedFood
          displayEmpty
          required
          disabled={isEnrolled}
        >
          <MenuItem value="" disabled>
            เลือกเมนูอาหาร
          </MenuItem>
          {activity.food.map((food: string, index: number) => (
            <MenuItem key={index} value={food}>
              {food}
            </MenuItem>
          ))}
        </Select>
      )}
    </div>
  );
}
