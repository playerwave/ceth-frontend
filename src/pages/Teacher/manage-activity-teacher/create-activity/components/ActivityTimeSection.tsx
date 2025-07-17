// components/AdminActivityForm/ActivityTimeSection.tsx
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { CreateActivityForm } from "../create_activity_admin";

interface Props {
  formData: CreateActivityForm;
  handleDateTimeChange: (name: string, newValue: Dayjs | null) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ActivityTimeSection: React.FC<Props> = ({
  formData,
  handleDateTimeChange,
  setFormData,
}) => {
  return (
    <div className="grid grid-cols-1 gap-2 w-full mt-10">
      <div>
        <label className="block font-semibold">
          วันและเวลาการดำเนินการกิจกรรม *
        </label>
        <div className="flex space-x-2 w-full">
          {/* Start */}
          <div className="w-1/2">
            <div className="flex flex-col">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  className="w-77.5"
                  minDate={dayjs(formData.end_register_date)}
                  value={
                    formData.start_activity_date
                      ? dayjs(formData.start_activity_date)
                      : null
                  }
                  onChange={(newValue) =>
                    handleDateTimeChange("start_activity_date", newValue)
                  }
                  slotProps={{
                    textField: {
                      sx: { height: "56px" },
                      error: !!(
                        formData.activity_status !== "Private" &&
                        formData.start_activity_date &&
                        ((formData.end_register_date &&
                          dayjs(formData.start_activity_date).isBefore(
                            dayjs(formData.end_register_date),
                          )) ||
                          (formData.start_register_date &&
                            dayjs(formData.start_activity_date).isBefore(
                              dayjs(formData.start_register_date),
                            )))
                      ),
                      helperText:
                        formData.activity_status !== "Private" &&
                        formData.start_activity_date
                          ? formData.end_register_date &&
                            dayjs(formData.start_activity_date).isBefore(
                              dayjs(formData.end_register_date),
                            )
                            ? "❌ วันและเวลาการดำเนินกิจกรรมต้องมากกว่าวันที่ปิดลงทะเบียน"
                            : formData.start_register_date &&
                                dayjs(formData.start_activity_date).isBefore(
                                  dayjs(formData.start_register_date),
                                )
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
                  minDate={dayjs(formData.start_activity_date)}
                  value={
                    formData.end_activity_date ? dayjs(formData.end_activity_date) : null
                  }
                  onChange={(newValue) =>
                    handleDateTimeChange("end_activity_date", newValue)
                  }
                  slotProps={{
                    textField: {
                      sx: { height: "56px" },
                      // error:
                      //   formData.activity_status !== "Private" &&
                      //   formData.end_activity_date &&
                      //   ((formData.start_activity_date &&
                      //     dayjs(formData.end_activity_date).isBefore(
                      //       dayjs(formData.start_activity_date),
                      //     )) ||
                      //     (formData.start_register_date &&
                      //       dayjs(formData.end_activity_date).isBefore(
                      //         dayjs(formData.start_register_date),
                      //       )) ||
                      //     (formData.end_register_date &&
                      //       dayjs(formData.end_activity_date).isBefore(
                      //         dayjs(formData.end_register_date),
                      //       ))),
                      error: !!(
  formData.activity_status !== "Private" &&
  formData.end_activity_date &&
  ((formData.start_activity_date &&
    dayjs(formData.end_activity_date).isBefore(dayjs(formData.start_activity_date))) ||
    (formData.start_register_date &&
      dayjs(formData.end_activity_date).isBefore(dayjs(formData.start_register_date))) ||
    (formData.end_register_date &&
      dayjs(formData.end_activity_date).isBefore(dayjs(formData.end_register_date)))
  )
),

                      helperText:
                        formData.activity_status !== "Private" && formData.end_activity_date
                          ? formData.start_activity_date &&
                            dayjs(formData.end_activity_date).isBefore(
                              dayjs(formData.start_activity_date),
                            )
                            ? "❌ วันที่ หรือ เวลาต้องมากกว่าช่วงเริ่มต้น"
                            : formData.start_register_date &&
                                dayjs(formData.end_activity_date).isBefore(
                                  dayjs(formData.start_register_date),
                                )
                              ? "❌ วันที่ หรือ เวลาสิ้นสุดกิจกรรมต้องอยู่หลังเวลาที่เปิดให้นิสิตที่มีสถานะ"
                              : formData.end_register_date &&
                                  dayjs(formData.end_activity_date).isBefore(
                                    dayjs(formData.end_register_date),
                                  )
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
          id="recieve_hours"
          name="recieve_hours"
          type="number"
          placeholder="จำนวนชั่วโมงที่จะได้รับ"
          value={
            formData.event_format !== "Course" &&
            formData.start_activity_date &&
            formData.end_activity_date
              ? dayjs(formData.end_activity_date).diff(
                  dayjs(formData.start_activity_date),
                  "hour",
                  true,
                )
              : formData.recieve_hours || ""
          }
          className="w-full"
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setFormData((prev: any) => ({
                ...prev,
                recieve_hours: value,
              }));
            }
          }}
          error={
            formData.activity_status === "Public" &&
            formData.event_format === "Course" &&
            (!formData.recieve_hours ||
              Number(formData.recieve_hours) <= 0)
          }
          helperText={
            formData.activity_status === "Public" &&
            formData.event_format === "Course" &&
            (!formData.recieve_hours ||
              Number(formData.recieve_hours) <= 0)
              ? "❌ ต้องระบุจำนวนชั่วโมงเป็นตัวเลขที่มากกว่า 0"
              : ""
          }
          disabled={formData.event_format !== "Course"}
          sx={{ height: "56px" }}
        />
      </div>
    </div>
  );
};

export default ActivityTimeSection;
