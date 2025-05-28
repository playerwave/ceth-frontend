// components/AdminActivityForm/DescriptionSection.tsx
import { TextField } from "@mui/material";

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
}

const DescriptionSection: React.FC<Props> = ({ formData, handleChange }) => {
  return (
    <div className="mt-5" >
      <br />
      <label className="block font-semibold w-50">คำอธิบายกิจกรรม</label>
      <TextField
        name="ac_description"
        value={formData.ac_description}
        onChange={handleChange}
        multiline
        rows={6}
        variant="outlined"
        fullWidth
        sx={{
          width: "35rem",
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.375rem",
            borderColor: "#9D9D9D",
          },
        }}
        placeholder="รายละเอียดกิจกรรม หรือ คำอธิบาย"
        required
      />
    </div>
  );
};

export default DescriptionSection;
