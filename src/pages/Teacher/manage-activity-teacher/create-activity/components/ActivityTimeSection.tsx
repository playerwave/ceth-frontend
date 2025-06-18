// components/AdminActivityForm/ActivityTimeSection.tsx
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  formData: any;
  handleDateTimeChange: (name: string, newValue: Dayjs | null) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ActivityTimeSection: React.FC<Props> = ({ formData, handleDateTimeChange, setFormData }) => {
  return (
    <div className="grid grid-cols-1 gap-2 w-full mt-10">
      <div>
        <label className="block font-semibold">วันและเวลาการดำเนินการกิจกรรม *</label>
        <div className="flex space-x-2 w-full">
          {/* Start */}
          <div className="w-1/2">
            <div className="flex flex-col">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  className="w-77.5"
                  minDate={dayjs(formData.ac_end_register)}
                  value={formData.ac_start_time ? dayjs(formData.ac_start_time) : null}
                  onChange={(newValue) => handleDateTimeChange("ac_start_time", newValue)}
                  slotProps={{
                    textField: {
                      sx: { height: "56px" },
                      error: !!(
                        formData.ac_status !== "Private" &&
                        formData.ac_start_time &&
                        ((formData.ac_end_register &&
                          dayjs(formData.ac_start_time).isBefore(dayjs(formData.ac_end_register))) ||
                          (formData.ac_normal_register &&
                            dayjs(formData.ac_start_time).isBefore(dayjs(formData.ac_normal_register))))
                      ),
                      helperText:
                        formData.ac_status !== "Private" && formData.ac_start_time
                          ? formData.ac_end_register &&
                            dayjs(formData.ac_start_time).isBefore(dayjs(formData.ac_end_register))
                            ? "❌ วันและเวลาการดำเนินกิจกรรมต้องมากกว่าวันที่ปิดลงทะเบียน"
                            : formData.ac_normal_register &&
                              dayjs(formData.ac_start_time).isBefore(dayjs(formData.ac_normal_register))
                            ? "❌ วันและเวลาการดำเนินกิจกรรมต้องอยู่หลังวันที่เปิดให้นิสิตสถานะ normal ลงทะเบียน"
                            : ""
                          : "",
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
            <p className="text-xs text-gray-500 mt-1">Start</p>
          </div>

          <span className="self-center font-semibold">-</span>

          {/* End */}
          <div className="w-1/2">
            <div className="flex flex-col">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  className="w-77.5"
                  minDate={dayjs(formData.ac_start_time)}
                  value={formData.ac_end_time ? dayjs(formData.ac_end_time) : null}
                  onChange={(newValue) => handleDateTimeChange("ac_end_time", newValue)}
                  slotProps={{
                    textField: {
                      sx: { height: "56px" },
                      error:
                        formData.ac_status !== "Private" &&
                        formData.ac_end_time &&
                        ((formData.ac_start_time &&
                          dayjs(formData.ac_end_time).isBefore(dayjs(formData.ac_start_time))) ||
                          (formData.ac_normal_register &&
                            dayjs(formData.ac_end_time).isBefore(dayjs(formData.ac_normal_register))) ||
                          (formData.ac_end_register &&
                            dayjs(formData.ac_end_time).isBefore(dayjs(formData.ac_end_register)))),
                      helperText:
                        formData.ac_status !== "Private" && formData.ac_end_time
                          ? formData.ac_start_time &&
                            dayjs(formData.ac_end_time).isBefore(dayjs(formData.ac_start_time))
                            ? "❌ วันที่ หรือ เวลาต้องมากกว่าช่วงเริ่มต้น"
                            : formData.ac_normal_register &&
                              dayjs(formData.ac_end_time).isBefore(dayjs(formData.ac_normal_register))
                            ? "❌ วันที่ หรือ เวลาสิ้นสุดกิจกรรมต้องอยู่หลังเวลาที่เปิดให้นิสิตที่มีสถานะ"
                            : formData.ac_end_register &&
                              dayjs(formData.ac_end_time).isBefore(dayjs(formData.ac_end_register))
                            ? "❌ วันที่ หรือ เวลาสิ้นสุดกิจกรรมต้องอยู่หลังเวลาปิดการลงทะเบียน"
                            : ""
                          : "",
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
            <p className="text-xs text-gray-500 mt-1">End</p>
          </div>
        </div>
      </div>

      {/* จำนวนชั่วโมงที่จะได้รับ */}
      <div className="w-77.5 mb-2">
        <label className="block font-semibold">จำนวนชั่วโมงที่จะได้รับ *</label>
        <TextField
          id="ac_recieve_hours"
          name="ac_recieve_hours"
          type="number"
          placeholder="จำนวนชั่วโมงที่จะได้รับ"
          value={
            formData.ac_location_type !== "Course" &&
            formData.ac_start_time &&
            formData.ac_end_time
              ? dayjs(formData.ac_end_time).diff(dayjs(formData.ac_start_time), "hour", true)
              : formData.ac_recieve_hours || ""
          }
          className="w-full"
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setFormData((prev: any) => ({
                ...prev,
                ac_recieve_hours: value,
              }));
            }
          }}
          error={
            formData.ac_status === "Public" &&
            formData.ac_location_type === "Course" &&
            (!formData.ac_recieve_hours || Number(formData.ac_recieve_hours) <= 0)
          }
          helperText={
            formData.ac_status === "Public" &&
            formData.ac_location_type === "Course" &&
            (!formData.ac_recieve_hours || Number(formData.ac_recieve_hours) <= 0)
              ? "❌ ต้องระบุจำนวนชั่วโมงเป็นตัวเลขที่มากกว่า 0"
              : ""
          }
          disabled={formData.ac_location_type !== "Course"}
          sx={{ height: "56px" }}
        />
      </div>
    </div>
  );
};

export default ActivityTimeSection;