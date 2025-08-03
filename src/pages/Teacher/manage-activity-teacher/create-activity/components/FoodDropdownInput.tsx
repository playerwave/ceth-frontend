import { Box, IconButton } from "@mui/material";
import useAutocomplete from "@mui/material/useAutocomplete";
import CheckIcon from "@mui/icons-material/Check";
import { Food } from "../../../../../types/model";
import { Root, InputWrapper, Listbox, Label } from "./StyledAutocomplete"; // นำเข้าจากไฟล์ style เดิม
import { Delete } from "@mui/icons-material";

interface Props {
  index: number;
  foodId: number;
  foods: Food[];
  updateFoodOption: (index: number, value: number) => void;
  removeFoodOption: (index: number) => void;
  disabled?: boolean;
}

const FoodDropdownInput: React.FC<Props> = ({
  index,
  foodId,
  foods,
  updateFoodOption,
  removeFoodOption,
  disabled = false,
}) => {
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: `food-select-${index}`,
    multiple: false,
    options: foods,
    value: foods.find((f) => f.food_id === foodId) ?? null,
    getOptionLabel: (option) => option.food_name,
    isOptionEqualToValue: (opt, val) => opt.food_id === val.food_id,
    onChange: (_, newValue) => {
      updateFoodOption(index, newValue?.food_id ?? 0);
    },
  });

  return (
    <Box className={`relative space-y-1 ${disabled ? "opacity-50" : ""}`}>
      <Label className="mb-1">เลือกอาหาร</Label>
      <Root {...getRootProps()}>
        <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
          <input {...getInputProps()} disabled={disabled} />
        </InputWrapper>
        {groupedOptions.length > 0 && !disabled && (
          <Listbox {...getListboxProps()}>
            {groupedOptions.map((option, idx) => (
              <li {...getOptionProps({ option, index: idx })} key={option.food_id}>
                <span>{option.food_name}</span>
                <CheckIcon fontSize="small" />
              </li>
            ))}
          </Listbox>
        )}
      </Root>

      <IconButton
        onClick={() => removeFoodOption(index)}
        color="error"
        size="small"
        disabled={disabled}
        sx={{ position: "absolute", top: 0, right: 0 }}
      >
        <Delete />
      </IconButton>
    </Box>
  );
};

export default FoodDropdownInput;
