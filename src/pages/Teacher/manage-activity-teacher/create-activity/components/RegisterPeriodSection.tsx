// components/AdminActivityForm/RegisterPeriodSection.tsx
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { CreateActivityForm } from "../create_activity_admin";

interface Props {
  formData: CreateActivityForm;
  handleDateTimeChange: (name: string, newValue: Dayjs | null) => void;
}

const RegisterPeriodSection: React.FC<Props> = ({
  formData,
  handleDateTimeChange,
}) => {
  return (
    <div className="flex flex-col ml-0">
      {" "}
      {/* ลบ space-y-6 ออก */}
      <div className="flex flex-col w-77.5">
        <label className="block font-semibold mb-1">
          วันและเวลาปิดการลงทะเบียน *
        </label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            minDate={dayjs()}
            value={
              formData.end_register_date ? dayjs(formData.end_register_date) : null
            }
            onChange={(newValue) =>
              handleDateTimeChange("end_register_date", newValue)
            }
            sx={{ height: "56px" }}
          />
        </LocalizationProvider>
      </div>
      <div className="flex flex-col w-77.5 mt-3">
        {" "}
        {/* เพิ่ม margin-top เล็กน้อย */}
        <label className="block font-semibold">
          วันและเวลาเปิดให้นิสิตสถานะ normal ลงทะเบียน *
        </label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            minDate={dayjs().add(1, "day")}
            value={
              formData.start_register_date
                ? dayjs(formData.start_register_date)
                : null
            }
            onChange={(newValue) =>
              handleDateTimeChange("start_register_date", newValue)
            }
            slotProps={{
              textField: {
                sx: { height: "56px" },
                error: !!(
                  formData.activity_status !== "Private" &&
                  formData.start_register_date &&
                  formData.end_register_date &&
                  (dayjs(formData.start_register_date).isBefore(
                    dayjs().startOf("day"),
                  ) ||
                    dayjs(formData.start_register_date).isAfter(
                      dayjs(formData.end_register_date),
                    ) ||
                    dayjs(formData.start_register_date).isSame(
                      dayjs(formData.end_register_date),
                      "day",
                    ))
                ),
                helperText:
                  formData.activity_status !== "Private" &&
                  formData.start_register_date &&
                  formData.end_register_date &&
                  (dayjs(formData.start_register_date).isBefore(
                    dayjs().startOf("day"),
                  ) ||
                    dayjs(formData.start_register_date).isAfter(
                      dayjs(formData.end_register_date),
                    ) ||
                    dayjs(formData.start_register_date).isSame(
                      dayjs(formData.end_register_date),
                      "day",
                    ))
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
