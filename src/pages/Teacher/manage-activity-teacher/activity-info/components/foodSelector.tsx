// import { Select, MenuItem } from "@mui/material";
// import { Frown } from "lucide-react";

// interface Props {
//   foodList?: string[];
//   locationType?: string;
// }

// export default function FoodSelector({ foodList = [], locationType }: Props) {
//   const noFood =
//     locationType !== "Onsite" ||
//     !Array.isArray(foodList) ||
//     foodList.length === 0;

//   return (
//     <div className="mt-4">
//       <p className="font-semibold font-[Sarabun]">อาหาร</p>
//       {noFood ? (
//         <p className="text-gray-500 mt-1 flex items-center">
//           ไม่มีอาหารสำหรับกิจกรรมนี้ <Frown className="ml-3" />
//         </p>
//       ) : (
//         <Select
//           className="w-[40%] mt-1"
//           value={foodList[0] || ""}
//           displayEmpty
//           onChange={(e) => console.log("เลือก:", e.target.value)}
//         >
//           {foodList.map((food, index) => (
//             <MenuItem key={index} value={food}>
//               {food}
//             </MenuItem>
//           ))}
//         </Select>
//       )}
//     </div>
//   );
// }

import { Select, MenuItem } from "@mui/material";
import { Frown } from "lucide-react";
import { Food } from "../../../../../types/model"; // ปรับ path ให้ตรง

interface Props {
  foodList?: Food[];
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
        <p className="text-gray-500 mt-1 flex items-center">
          ไม่มีอาหารสำหรับกิจกรรมนี้ <Frown className="ml-3" />
        </p>
      ) : (
        <Select
          className="w-[40%] mt-1"
          value={foodList[0]?.food_id || ""}
          displayEmpty
          onChange={(e) => console.log("เลือก:", e.target.value)}
        >
          {foodList.map((food) => (
            <MenuItem key={food.food_id} value={food.food_id}>
              {food.food_name}
            </MenuItem>
          ))}
        </Select>
      )}
    </div>
  );
}
