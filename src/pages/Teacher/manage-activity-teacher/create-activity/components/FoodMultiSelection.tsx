import { Autocomplete, TextField, Chip } from "@mui/material";
import { Food } from "../../../../../types/model";

interface Props {
  foods: Food[];
  selectedFoodIds: number[];
  setSelectedFoodIds: (val: number[]) => void;
  disabled?: boolean;
}

const FoodMultiSelect: React.FC<Props> = ({
  foods,
  selectedFoodIds,
  setSelectedFoodIds,
  disabled = false,
}) => {
  const selectedFoods = foods.filter((f) =>
    selectedFoodIds.includes(f.food_id),
  );

  return (
    <Autocomplete
      multiple
      options={foods}
      getOptionLabel={(option) => option.food_name}
      value={selectedFoods}
      onChange={(_, newValues) => {
        setSelectedFoodIds(newValues.map((f) => f.food_id));
      }}
      disabled={disabled}
      isOptionEqualToValue={(opt, val) => opt.food_id === val.food_id}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.food_name}
            {...getTagProps({ index })}
            key={option.food_id}
          />
        ))
      }
      renderInput={(params) => (
        <TextField {...params}  variant="outlined" />
      )}
    //   sx={{ minWidth: 300 }}
    sx={{
  minWidth: 564,
  maxWidth: 56, // ✅ หรือ 100% ถ้ามี parent คุมความกว้าง
  width: "100%", // ✅ เพื่อให้ responsive ตาม container
}}
    />
  );
};

export default FoodMultiSelect;
