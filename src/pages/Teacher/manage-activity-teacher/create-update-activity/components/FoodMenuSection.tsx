import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { CreateActivityForm } from "../create.activity.teacher";
import { useFoodStore } from "../../../../../stores/Teacher/food.store.teacher";
import React, { useEffect, useRef } from "react";
import FoodDropdownInput from "./FoodDropdownInput"; // ✅ ย้าย Autocomplete ไป component ย่อย

interface Props {
  formData: CreateActivityForm;
  updateFoodOption: (index: number, value: number) => void;
  removeFoodOption: (index: number) => void;
  addFoodOption: () => void;
}

const FoodMenuSection: React.FC<Props> = ({
  formData,
  updateFoodOption,
  removeFoodOption,
  addFoodOption,
}) => {
  const foods = useFoodStore((state) => state.foods);
  const fetchFoods = useFoodStore((state) => state.fetchFoods);
  const foodLoading = useFoodStore((state) => state.foodLoading);
  const foodError = useFoodStore((state) => state.foodError);

  useEffect(() => {
    if (formData.event_format === "Onsite" && foods.length === 0) {
      fetchFoods();
    }
  }, [formData.event_format, foods]);

  // useEffect(() => {
  //   if (
  //     formData.event_format === "Onsite" &&
  //     foods.length > 0 &&
  //     formData.selectedFoods.length === 0
  //   ) {
  //     addFoodOption();
  //   }
  // }, [formData.event_format, foods, formData.selectedFoods]);

  const hasAdded = useRef(false);

useEffect(() => {
  if (
    formData.event_format === "Onsite" &&
    foods.length > 0 &&
    formData.selectedFoods.length === 0 &&
    !hasAdded.current
  ) {
    hasAdded.current = true;
    addFoodOption();
  }
}, [formData.event_format, foods, formData.selectedFoods]);

useEffect(() => {
  localStorage.setItem("selectedFoods", JSON.stringify(formData.selectedFoods));
}, [formData.selectedFoods]);



  if (formData.event_format !== "Onsite") return null;

  return (
    <Paper className={`w-140 mt-5 p-6 bg-white border border-gray-300 rounded-lg shadow-sm ${
      formData.event_format !== "Onsite" ? "opacity-50" : ""
    }`}>
      <Typography variant="h6" className="font-semibold mb-2">
        อาหาร {formData.event_format !== "Onsite" ? "(ไม่จำเป็น)" : "*"}
      </Typography>

      {formData.event_format !== "Onsite" && (
        <Typography variant="body2" color="textSecondary" className="mb-3">
          อาหารไม่จำเป็นสำหรับกิจกรรมแบบ {formData.event_format}
        </Typography>
      )}

      {foodLoading && <Typography>กำลังโหลดข้อมูลอาหาร...</Typography>}
      {foodError && <Typography color="error">{foodError}</Typography>}

      <Box className="space-y-3">
        {formData.selectedFoods.map((foodId, index) => (
          <FoodDropdownInput
            key={index}
            index={index}
            foodId={foodId}
            foods={foods}
            updateFoodOption={updateFoodOption}
            removeFoodOption={removeFoodOption}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default FoodMenuSection;
