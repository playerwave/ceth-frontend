// components/AdminActivityForm/DescriptionSection.tsx
import { TextField } from "@mui/material";
import { CreateActivityForm } from "../create_activity_admin";
import { validateField, ValidationMode } from "../utils/form_utils";

interface Props {
  formData: CreateActivityForm;
  handleChange: (e: React.ChangeEvent<any>) => void;
  disabled?: boolean;
  validationMode?: ValidationMode;
  originalActivityStatus?: string;
}

const DescriptionSection: React.FC<Props> = ({ 
  formData, 
  handleChange, 
  disabled = false, 
  validationMode = 'create',
  originalActivityStatus 
}) => {
  // ✅ ใช้ validateField function ใหม่
  const descriptionValidation = validateField('description', formData, validationMode, originalActivityStatus);

  return (
    <div className="mt-5">
      <br />
      <label className="block font-semibold w-50">คำอธิบายกิจกรรม</label>
      <TextField
        name="description"
        value={formData.description}
        onChange={handleChange}
        disabled={disabled}
        multiline
        rows={6}
        variant="outlined"
        fullWidth
        sx={{
          width: "35rem",
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.375rem",
            borderColor: "#9D9D9D",
            alignItems: "start",
          },
          "& .MuiInputBase-inputMultiline": {
            minHeight: "42px",
          },
        }}
        placeholder="รายละเอียดกิจกรรม หรือ คำอธิบาย"
        required
        error={descriptionValidation.hasError}
        helperText={descriptionValidation.helperText}
      />
    </div>
  );
};

export default DescriptionSection;
