// components/AdminActivityForm/ActivityTimeSection.tsx
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { CreateActivityForm } from "../create_activity_admin";
import { convertBackendTimeToLocal } from "../utils/timeUtils";

interface Props {
  formData: CreateActivityForm;
  handleDateTimeChange: (name: string, newValue: Dayjs | null) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  disabled?: boolean;
  // ✅ เพิ่ม props สำหรับจำกัดการแก้ไขเฉพาะ field
  isStartActivityDateEditable?: boolean;
  isEndActivityDateEditable?: boolean;
  isRecieveHoursEditable?: boolean;
}

const ActivityTimeSection: React.FC<Props> = ({
  formData,
  handleDateTimeChange,
  setFormData,
  disabled = false,
  isStartActivityDateEditable = true,
  isEndActivityDateEditable = true,
  isRecieveHoursEditable = true,
}) => {

  const isPublic = formData.activity_status === "Public";
const isOnsiteOrOnline =
  formData.event_format === "Onsite" || formData.event_format === "Online";

const endReg = formData.end_register_date ? convertBackendTimeToLocal(formData.end_register_date) : null;
const startAct = formData.start_activity_date ? convertBackendTimeToLocal(formData.start_activity_date) : null;
const endAct = formData.end_activity_date ? convertBackendTimeToLocal(formData.end_activity_date) : null;

// กฎใหม่: เริ่มกิจกรรมต้องเป็น "วันถัดไป" หลังวันปิดลงทะเบียน
const mustBeNextDay = !!(isPublic && isOnsiteOrOnline && endReg);
const startMinDate = mustBeNextDay
  ? endReg!.startOf("day").add(1, "day") // วันถัดไป 00:00
  : (endReg || dayjs().add(1, "day"));

// const startSameDayAsEndReg = !!(mustBeNextDay && startAct && endReg && startAct.startOf("day").isSame(endReg.startOf("day")));
const startBeforeOrOnEndReg = !!(mustBeNextDay && startAct && endReg && !startAct.startOf("day").isAfter(endReg.startOf("day"))); // ครอบคลุมทั้งก่อน/วันเดียวกัน

  return (

<div className="grid grid-cols-1 gap-2 w-full mt-11">
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
  minDate={startMinDate}
  value={startAct || null}
  onChange={(newValue) =>
    handleDateTimeChange("start_activity_date", newValue)
  }
  disabled={disabled || !formData.end_register_date || !isStartActivityDateEditable}
  slotProps={{
    textField: {
      sx: { height: "56px" },
      error: !!(
        !disabled &&
        isPublic &&
        startAct &&
        (
          // ❌ ต้องเป็นวันถัดไปจาก end_register_date (ห้ามวันเดียวกันหรือก่อน)
          startBeforeOrOnEndReg ||
          // เงื่อนไขเดิม
          (endAct && (
            endAct.diff(startAct, "hour") < 1 ||
            startAct.isSame(endAct)
          ))
        )
      ),
      helperText: (() => {
        if (!(!disabled && isPublic && startAct)) return "";
        if (startBeforeOrOnEndReg) {
          return "วันเริ่มกิจกรรมต้องเป็นวันถัดไปหลังวันปิดลงทะเบียน (อย่างน้อย 1 วัน)";
        }
        if (endAct && (endAct.diff(startAct, "hour") < 1 || startAct.isSame(endAct))) {
          return "วันและเวลาการดำเนินกิจกรรมต้องห่างกันอย่างน้อย 1 ชั่วโมง";
        }
        return "";
      })(),
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
              minDate={
                formData.start_activity_date
                  ? convertBackendTimeToLocal(formData.start_activity_date)?.add(1, "hour")
                  : formData.end_register_date
                  ? convertBackendTimeToLocal(formData.end_register_date)?.add(1, "hour")
                  : dayjs().add(1, "day")
              }
              value={
                formData.end_activity_date
                  ? convertBackendTimeToLocal(formData.end_activity_date)
                  : null
              }
              onChange={(newValue) =>
                handleDateTimeChange("end_activity_date", newValue)
              }
              disabled={disabled || !formData.start_activity_date || !isEndActivityDateEditable}
              slotProps={{
                textField: {
                  sx: { height: "56px" },
                  error: !!(
                    !disabled &&
                    formData.activity_status === "Public" &&
                    formData.end_activity_date &&
                    formData.start_activity_date &&
                    ((formData.start_activity_date &&
                      dayjs(formData.end_activity_date).isBefore(
                        dayjs(formData.start_activity_date),
                      )) ||
                      (formData.start_register_date &&
                        dayjs(formData.end_activity_date).isBefore(
                          dayjs(formData.start_register_date),
                        )) ||
                      (formData.end_register_date &&
                        dayjs(formData.end_activity_date).isBefore(
                          dayjs(formData.end_register_date),
                        )) ||
                      dayjs(formData.end_activity_date).diff(
                        dayjs(formData.start_activity_date),
                        'hour'
                      ) < 1 ||
                      dayjs(formData.end_activity_date).isSame(
                        dayjs(formData.start_activity_date)
                      ))
                  ),
                  helperText:
                    !disabled &&
                    formData.activity_status === "Public" &&
                    formData.end_activity_date &&
                    formData.start_activity_date
                      ? (formData.start_activity_date &&
                          dayjs(formData.end_activity_date).isBefore(
                            dayjs(formData.start_activity_date),
                          )
                          ? "วันที่ หรือ เวลาต้องมากกว่าช่วงเริ่มต้น"
                          : formData.start_register_date &&
                            dayjs(formData.end_activity_date).isBefore(
                              dayjs(formData.start_register_date),
                            )
                          ? "วันที่ หรือ เวลาสิ้นสุดกิจกรรมต้องอยู่หลังเวลาที่เปิดให้นิสิตที่มีสถานะ normal"
                          : formData.end_register_date &&
                            dayjs(formData.end_activity_date).isBefore(
                              dayjs(formData.end_register_date),
                            )
                          ? "วันที่ หรือ เวลาสิ้นสุดกิจกรรมต้องอยู่หลังเวลาปิดการลงทะเบียน"
                          : dayjs(formData.end_activity_date).isSame(
                              dayjs(formData.start_activity_date)
                            )
                          ? "วันและเวลาการดำเนินกิจกรรมต้องไม่ตรงกัน"
                          : dayjs(formData.end_activity_date).diff(
                              dayjs(formData.start_activity_date),
                              'hour'
                            ) < 1
                          ? "วันและเวลาการดำเนินกิจกรรมต้องห่างกันอย่างน้อย 1 ชั่วโมง"
                          : "")
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
  <div className="w-77.5 mb-2">
       <label className="block font-semibold">จำนวนชั่วโมงที่จะได้รับ *</label>
        

        {formData.event_format !== "Course" &&
        formData.start_activity_date &&
        formData.end_activity_date && (() => {
          const startTime = dayjs(formData.start_activity_date);
          const endTime = dayjs(formData.end_activity_date);
          if (!startTime || !endTime) return false;
          const lunchStart = startTime.hour(12).minute(0).second(0);
          const lunchEnd = startTime.hour(13).minute(0).second(0);
          const hasLunchBreak = startTime.isBefore(lunchStart) && endTime.isAfter(lunchEnd);
          return hasLunchBreak;
        })() && (
          <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-blue-600 text-sm">
            ℹ️ ลบ 1 ชั่วโมงสำหรับพักเที่ยง (12:00-13:00)
          </div>
        )}
        
        <TextField
          id="recieve_hours"
          name="recieve_hours"
          type="number"
          placeholder="จำนวนชั่วโมงที่จะได้รับ"
          value={
            formData.event_format !== "Course" &&
            formData.start_activity_date &&
            formData.end_activity_date
                              ? (() => {
                  const startTime = dayjs(formData.start_activity_date);
                  const endTime = dayjs(formData.end_activity_date);
                  if (!startTime || !endTime) return formData.recieve_hours || "";
                  
                  const totalHours = endTime.diff(startTime, "hour", true);
                  
                  // ✅ ตรวจสอบว่ากิจกรรมคาบเกี่ยวช่วงเที่ยงหรือไม่
                  const lunchStart = startTime.hour(12).minute(0).second(0);
                  const lunchEnd = startTime.hour(13).minute(0).second(0);
                  
                  // ถ้าเริ่มก่อนเที่ยงและจบหลังเที่ยง ให้ลบ 1 ชั่วโมง
                  const hasLunchBreak = startTime.isBefore(lunchStart) && endTime.isAfter(lunchEnd);
                  
                  // ✅ แปลงเป็นจำนวนเต็ม
                  const finalHours = hasLunchBreak ? Math.max(0, totalHours - 1) : totalHours;
                  return Math.round(finalHours);
                })()
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
          disabled={disabled || formData.event_format !== "Course" || !isRecieveHoursEditable}
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
              ? "ต้องระบุจำนวนชั่วโมงเป็นตัวเลขที่มากกว่า 0"
              : ""
          }
          sx={{ height: "56px" }}
          
        />
      </div>
</div>
  );
};

export default ActivityTimeSection;
