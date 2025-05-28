import { Select, MenuItem } from "@mui/material";
import { Frown } from "lucide-react";

interface Props {
  foodList?: string[];
  locationType?: string;
}

export default function FoodSelector({ foodList = [], locationType }: Props) {
  const noFood =
    locationType !== "Onsite" ||
    !Array.isArray(foodList) ||
    foodList.length === 0;

  return (
    <div className="mt-4">
      <p className="font-semibold font-[Sarabun]">อาหาร</p>
      {noFood ? (
        <p className="text-gray-500 mt-1 flex items-center text-sm sm:text-base md:text-lg">
          ไม่มีอาหารสำหรับกิจกรรมนี้{" "}
          <Frown className="ml-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </p>
      ) : (
        <Select
          className="w-[40%] sm:w-[40%] md:w-[40%] xl:w-[40%] mt-2"
          value={foodList[0] || ""}
          displayEmpty
          onChange={(e) => console.log("เลือก:", e.target.value)}
          sx={{
            fontSize: {
              xs: "14px",
              sm: "15px",
              md: "16px",
              xl: "18px",
            },
          }}
        >
          {foodList.map((food, index) => (
            <MenuItem key={index} value={food}>
              {food}
            </MenuItem>
          ))}
        </Select>
      )}
    </div>
  );
}
