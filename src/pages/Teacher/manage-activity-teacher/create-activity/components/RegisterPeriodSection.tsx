// components/AdminActivityForm/RegisterPeriodSection.tsx
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  formData: any;
  handleDateTimeChange: (name: string, newValue: Dayjs | null) => void;
}

const RegisterPeriodSection: React.FC<Props> = ({ formData, handleDateTimeChange }) => {
  return (
    <div className="flex flex-col ml-0">  {/* ลบ space-y-6 ออก */}
      <div className="flex flex-col w-77.5">
        <label className="block font-semibold mb-1">วันและเวลาปิดการลงทะเบียน *</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            minDate={dayjs()}
            value={formData.ac_end_register ? dayjs(formData.ac_end_register) : null}
            onChange={(newValue) => handleDateTimeChange("ac_end_register", newValue)}
            sx={{ height: "56px" }}
          />
        </LocalizationProvider>
      </div>

      <div className="flex flex-col w-77.5 mt-3">  {/* เพิ่ม margin-top เล็กน้อย */}
        <label className="block font-semibold">วันและเวลาเปิดให้นิสิตสถานะ normal ลงทะเบียน *</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            minDate={dayjs().add(1, "day")}
            value={formData.ac_normal_register ? dayjs(formData.ac_normal_register) : null}
            onChange={(newValue) => handleDateTimeChange("ac_normal_register", newValue)}
            slotProps={{
              textField: {
                sx: { height: "56px" },
                error: !!(
                  formData.ac_status !== "Private" &&
                  formData.ac_normal_register &&
                  formData.ac_end_register &&
                  (
                    dayjs(formData.ac_normal_register).isBefore(dayjs().startOf("day")) ||
                    dayjs(formData.ac_normal_register).isAfter(dayjs(formData.ac_end_register)) ||
                    dayjs(formData.ac_normal_register).isSame(dayjs(formData.ac_end_register), "day")
                  )
                ),
                helperText:
                  formData.ac_status !== "Private" &&
                  formData.ac_normal_register &&
                  formData.ac_end_register &&
                  (
                    dayjs(formData.ac_normal_register).isBefore(dayjs().startOf("day")) ||
                    dayjs(formData.ac_normal_register).isAfter(dayjs(formData.ac_end_register)) ||
                    dayjs(formData.ac_normal_register).isSame(dayjs(formData.ac_end_register), "day")
                  )
                    ? "วันเปิดให้นิสิตสถานะ normal ลงทะเบียน ต้องอยู่หลังวันนี้ และไม่ตรงกับหรือเลยวันปิดลงทะเบียน"
                    : "",
              },
            }}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};



export default RegisterPeriodSection;
