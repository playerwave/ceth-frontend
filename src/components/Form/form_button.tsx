import React from "react";
import { Link } from "react-router-dom";

const FormButtons: React.FC = () => {
  return (
    <div className="flex justify-end space-x-4 mt-4">
      
        <button type="button" className="bg-red-600 text-white px-6 py-2 rounded">ยกเลิก</button>
     
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">สร้าง</button>
    </div>
  );
};

export default FormButtons;
