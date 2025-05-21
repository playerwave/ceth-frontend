import React from "react";
import { useNavigate } from "react-router-dom";
import { CopyPlus } from "lucide-react";

const AddFoodButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="justify-end flex mr-33 mt-7">
      <button
        onClick={() => navigate("/create-food")}
        className="ml-4 px-4 py-2 bg-blue-800 text-white font-medium rounded-xl hover:bg-blue-900 w-39 gap-7 flex"
      >
        เพิ่มอาหาร
        <CopyPlus />
      </button>
    </div>
  );
};

export default AddFoodButton;
