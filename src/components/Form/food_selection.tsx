import React from "react";
import { FormData } from "./formdata"; // ✅ นำเข้า type

interface Props {
  formData: FormData;
  handleChange: (food: string) => void; // ✅ เปลี่ยนให้รับค่า string ไม่ใช่ event
  updateFoodOption: (index: number, newValue: string) => void;
  removeFoodOption: (index: number) => void;
  addFoodOption: () => void;
}

const FoodSelection: React.FC<Props> = ({ formData, handleChange, updateFoodOption, removeFoodOption, addFoodOption }) => {
  return (
    <div className="w-2xl mt-5 bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
      <label className="block font-semibold mb-2">อาหาร *</label>
      {formData.foodOptions.map((menu, index) => (
        <div key={index} className="flex items-center space-x-2 mb-2">
          {/* ✅ ใช้ handleChange (toggleFoodSelection) ที่ถูกต้อง */}
          <input 
            type="checkbox" 
            checked={formData.selectedFoods.includes(menu)} 
            onChange={() => handleChange(menu)} 
            className="w-5 h-5" 
          />
          <input 
            type="text" 
            value={menu} 
            onChange={(e) => updateFoodOption(index, e.target.value)} 
            className="w-full p-2 border rounded" 
          />
          <button type="button" onClick={() => removeFoodOption(index)} className="bg-red-500 text-white px-2 py-1 rounded">
            X
          </button>
        </div>
      ))}
      <button type="button" onClick={addFoodOption} className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
        เพิ่มอาหาร
      </button>
    </div>
  );
};

export default FoodSelection;
