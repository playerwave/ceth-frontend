// components/AdminActivityForm/DescriptionSection.tsx
import { TextField } from "@mui/material";
import { CreateActivityForm } from "../create_activity_admin";

interface Props {
  formData: CreateActivityForm;
  handleChange: (e: React.ChangeEvent<any>) => void;
  disabled?: boolean;
}

const DescriptionSection: React.FC<Props> = ({ formData, handleChange, disabled = false }) => {
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
        // sx={{
        //   width: "35rem",
        //   height: "100%",
        //   mb: 2,
        //   "& .MuiOutlinedInput-root": {
        //     borderRadius: "0.375rem",
        //     borderColor: "#9D9D9D",
        //   },
        // }}
        sx={{
    width: "35rem",
    "& .MuiOutlinedInput-root": {
      borderRadius: "0.375rem",
      borderColor: "#9D9D9D",
      alignItems: "start",
    },
    "& .MuiInputBase-inputMultiline": {
      minHeight: "42px", // ✅ ตั้งความสูง textarea
    },
  }}
        placeholder="รายละเอียดกิจกรรม หรือ คำอธิบาย"
        required
        error={
          formData.activity_status === "Public" &&
          formData.description &&
          formData.description.length > 2000
        }
        helperText={
          formData.activity_status === "Public" &&
          formData.description &&
          formData.description.length > 2000
            ? "คำอธิบายต้องไม่เกิน 2000 ตัวอักษร"
            : ""
        }
      />
    </div>
  );
};

export default DescriptionSection;
