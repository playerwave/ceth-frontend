import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CopyPlus, Filter } from "lucide-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";


const AddFoodButton = () => {
  const navigate = useNavigate();

 

  return (
    <div className="flex flex-row flex-wrap justify-center sm:justify-end gap-3 mt-4 md:mt-7">
      {/* ปุ่มเพิ่มอาหาร */}
      <button
        onClick={() => navigate("/create-food-teacher")}
        className="flex-1 sm:flex-none px-3 py-2 text-sm bg-blue-800 text-white rounded-lg hover:bg-blue-900 gap-1 flex items-center justify-center min-w-[100px]"
      >
        <span className="md:hidden">เพิ่มอาหาร</span>
        <span className="hidden md:inline">เพิ่มอาหาร</span>
        <CopyPlus className="w-4 h-4" />
      </button>

    

     
    </div>
  );
};

export default AddFoodButton;
