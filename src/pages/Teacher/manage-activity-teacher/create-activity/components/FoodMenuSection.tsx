// components/AdminActivityForm/FoodMenuSection.tsx
import { Box, IconButton, Paper, TextField, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import Button from "../../../../../components/Button";

interface Props {
  formData: any;
  updateFoodOption: (index: number, value: string) => void;
  removeFoodOption: (index: number) => void;
  addFoodOption: () => void;
}

const FoodMenuSection: React.FC<Props> = ({
  formData,
  updateFoodOption,
  removeFoodOption,
  addFoodOption,
}) => {
  return (
    <Paper
      className={`w-140 mt-5 p-6 bg-white border border-gray-300 rounded-lg shadow-sm ${
        formData.ac_location_type !== "Onsite" ? "opacity-50" : ""
      }`}
    >
      <Typography variant="h6" className="font-semibold mb-2">
        อาหาร *
      </Typography>

      {/* เมนูอาหาร */}
      <Box className="pr-2 space-y-2 flex flex-col">
        {formData.ac_food?.map((menu: string, index: number) => (
          <Box key={index} className="flex items-center space-x-2">
            <TextField
              fullWidth
              value={menu}
              onChange={(e) => updateFoodOption(index, e.target.value)}
              variant="outlined"
              size="small"
              className="border-gray-400 rounded"
              disabled={formData.ac_location_type !== "Onsite"}
            />
            <IconButton
              onClick={() => removeFoodOption(index)}
              color="error"
              disabled={formData.ac_location_type !== "Onsite"}
            >
              <Delete />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* ปุ่มเพิ่มเมนู */}
      {formData.ac_location_type === "Onsite" && (
        <Box className="flex justify-end mt-2">
          <Button
            onClick={addFoodOption}
            variant="contained"
            color="blue"
            startIcon={<Add />}
            className="mt-4 text-white"
          >
            เพิ่มอาหาร
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default FoodMenuSection;
