import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CopyPlus } from "lucide-react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

interface AddFoodButtonProps {
  onFilterPrice: (min: number | "", max: number | "") => void;
}

const AddFoodButton: React.FC<AddFoodButtonProps> = ({ onFilterPrice }) => {
  const navigate = useNavigate();

  // State dialog เปิด/ปิด
  const [openDialog, setOpenDialog] = useState(false);

  // State ช่วงราคา
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <div className="flex justify-end gap-4 mt-7">
      <button
        onClick={handleOpenDialog}
        className="ml-4 px-4 py-2 bg-blue-800 text-white font-medium rounded-xl hover:bg-blue-900 gap-2 flex items-center"
      >
        กรองช่วงราคา
      </button>

      <button
        onClick={() => navigate("/create-food")}
        className="ml-4 px-4 py-2 bg-blue-800 text-white font-medium rounded-xl hover:bg-blue-900 w-35 gap-2 flex items-center"
      >
        เพิ่มอาหาร
        <CopyPlus />
      </button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>กรองช่วงราคา</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ราคาต่ำสุด"
            type="number"
            fullWidth
            variant="standard"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
          <TextField
            margin="dense"
            label="ราคาสูงสุด"
            type="number"
            fullWidth
            variant="standard"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>ยกเลิก</Button>
          <Button
            onClick={() => {
              onFilterPrice(minPrice, maxPrice);
              handleCloseDialog();
            }}
          >
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddFoodButton;
