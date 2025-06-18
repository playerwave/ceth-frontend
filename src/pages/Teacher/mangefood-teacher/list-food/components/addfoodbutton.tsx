import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CopyPlus, Filter } from "lucide-react";
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
    <div className="flex flex-row flex-wrap justify-center sm:justify-end gap-3 mt-4 md:mt-7">

      {/* ปุ่มเพิ่มอาหาร */}
      <button
        onClick={() => navigate("/create-food")}
        className="flex-1 sm:flex-none px-3 py-2 text-sm bg-blue-800 text-white rounded-lg hover:bg-blue-900 gap-1 flex items-center justify-center min-w-[100px]"
      >
        <span className="md:hidden">เพิ่มอาหาร</span>
        <span className="hidden md:inline">เพิ่มอาหาร</span>
        <CopyPlus className="w-4 h-4" />
      </button>

      {/* ปุ่มกรองราคา */}
      <button
        onClick={handleOpenDialog}
        className="flex-1 sm:flex-none px-3 py-2 text-sm bg-blue-800 text-white rounded-lg hover:bg-blue-900 gap-1 flex items-center justify-center min-w-[100px]"
      >
       
        <span>กรองราคา</span>
      </button>

      {/* Dialog - ปรับให้ responsive */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            margin: '16px',
            width: 'calc(100% - 32px)',
          }
        }}
      >
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
        <DialogActions className="p-4">
          <Button onClick={handleCloseDialog} className="flex-1">
            ยกเลิก
          </Button>
          <Button
            onClick={() => {
              onFilterPrice(minPrice, maxPrice);
              handleCloseDialog();
            }}
            className="flex-1"
            variant="contained"
          >
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddFoodButton;