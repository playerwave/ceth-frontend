import { FormData } from "../Form/formdata"; 
import React from "react";


interface Props {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const EvaluationSelection: React.FC<Props> = ({ formData, handleChange }) => {
  return (
    <div className="mt-4">
      <label className="block font-semibold">แบบประเมิน *</label>
      <select name="evaluationType" value={formData.evaluationType} onChange={handleChange} className="w-2xl p-2 border rounded mb-4">
        <option value="แบบประเมิน 1">แบบประเมิน 1</option>
        <option value="แบบประเมิน 2">แบบประเมิน 2</option>
        <option value="แบบประเมิน 3">แบบประเมิน 3</option>
      </select>
    </div>
  );
};

export default EvaluationSelection;
