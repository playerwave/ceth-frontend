import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CopyPlus, Filter } from "lucide-react";
import {

  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Button from "../../../../../components/Button";


const AddFoodButton = () => {
  const navigate = useNavigate();



  return (
    <div className="flex flex-row flex-wrap justify-center sm:justify-end gap-3 mt-4 md:mt-7">
      {/* ปุ่มเพิ่มอาหาร */}
      <Button
        onClick={() => navigate("/create-food-teacher")}
        className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-800 text-white rounded-lg hover:bg-blue-900 min-w-[100px]"
      >
        <span className="hidden sm:inline">เพิ่มอาหาร</span>
        <span className="inline sm:hidden">เพิ่ม</span>
        <CopyPlus className="w-4 h-4" />
      </Button>





    </div>
  );
};

export default AddFoodButton;
