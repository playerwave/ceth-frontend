// components/AdminActivityForm/AssessmentSection.tsx
import { Box, MenuItem, Select, TextField, SelectChangeEvent } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { CreateActivityForm } from "../create_activity_admin";
import { Assessment } from "../../../../../types/model";
import { convertBackendTimeToLocal, convertToLocalTimeForPicker } from "../utils/timeUtils";

// เพิ่ม timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  formData: CreateActivityForm;
  assessments: Assessment[];
  handleChange: (e: SelectChangeEvent<any>) => void;
  handleDateTimeChange: (name: string, newValue: Dayjs | null) => void;
  disabled?: boolean;
  // ✅ เพิ่ม props สำหรับจำกัดการแก้ไขเฉพาะ field
  isAssessmentIdEditable?: boolean;
  isStartAssessmentEditable?: boolean;
  isEndAssessmentEditable?: boolean;
}

const AssessmentSection: React.FC<Props> = ({
  formData,
  assessments,
  handleChange,
  handleDateTimeChange,
  disabled = false,
  isAssessmentIdEditable = true,
  isStartAssessmentEditable = true,
  isEndAssessmentEditable = true,
}) => {

const isPublic = formData.activity_status === "Public";
const isOnsiteOrOnline = formData.event_format === "Onsite" || formData.event_format === "Online";

const endAct = formData.end_activity_date ? dayjs(formData.end_activity_date) : null;
const startAsm = formData.start_assessment ? dayjs(formData.start_assessment) : null;
const endAsm   = formData.end_assessment ? dayjs(formData.end_assessment) : null;

  return (
    <div className="flex space-x-6 items-center mt-6">
  <div className="border-[#9D9D9D]">
    <label className="block font-semibold">แบบประเมิน *</label>
    <Select
      labelId="assessment"
      name="assessment_id"
      className="w-140"
      value={formData.assessment_id || ""}
      onChange={handleChange}
      disabled={disabled || !isAssessmentIdEditable}
      displayEmpty
      renderValue={(selected) => {
        if (!selected) return "เลือกเเบบประเมิน";
        return assessments.find((a) => a.assessment_id === selected)?.assessment_name || "";
      }}
    >
      <MenuItem disabled value="">
        เลือกเเบบประเมิน
      </MenuItem>
      {assessments && assessments.length > 0 ? (
        assessments.map((assessment) => (
          <MenuItem key={assessment.assessment_id} value={assessment.assessment_id}>
            {assessment.assessment_name}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>กำลังโหลดข้อมูล...</MenuItem>
      )}
    </Select>
  </div>

  <div className="mt-5">
    <label className="block font-semibold">
      วันและเวลาเริ่มและสิ้นสุดการทำแบบประเมิน *
    </label>

    <div className="flex space-x-2 w-full">
      {/* Start */}
      <div className="w-1/2">
        <div className="flex flex-col">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
  className="w-77.5"
  // ให้เลือกได้ "ตั้งแต่วันสิ้นสุดกิจกรรม" เป็นต้นไป (เวลาเดี๋ยวคุมด้วย error)
  minDate={endAct ?? dayjs()}
  value={startAsm ?? null}
  onChange={(newValue) => handleDateTimeChange("start_assessment", newValue)}
  disabled={disabled || !endAct || !isStartAssessmentEditable}
  slotProps={{
    textField: {
      sx: { height: "56px" },
      error: !!(
        !disabled &&
        isPublic &&
        isOnsiteOrOnline &&
        (
          !startAsm ||
          (endAct && startAsm.isBefore(endAct)) ||               // <— ไม่เป็นวันเดียวกัน/หลัง หรือเวลา < endAct
          (endAsm && startAsm.isAfter(endAsm)) ||                // start > end assessment
          (endAsm && endAsm.diff(startAsm, "hour") < 1)          // ระยะห่าง < 1 ชม.
        )
      ),
      helperText: (() => {
        if (!(!disabled && isPublic && isOnsiteOrOnline)) return "";
        if (!startAsm) return "❌ กรุณาเลือกวันและเวลาเริ่มการทำแบบประเมิน";
        if (endAct && startAsm.isBefore(endAct)) {
          // ข้อความใหม่ตาม requirement
          return "❌ วันที่และเวลาเปิดให้ทำแบบประเมินต้องอยู่วันที่เดียวกันหรือหลังวันที่จบกิจกรรมและเวลาต้องอยู่เท่ากับหรือหลังจากเวลาจบกิจกรรม";
        }
        if (endAsm && startAsm.isAfter(endAsm)) {
          return "❌ วันเปิดประเมินต้องอยู่ก่อนวันปิดประเมิน";
        }
        if (endAsm && endAsm.diff(startAsm, "hour") < 1) {
          return "❌ วันเปิดและปิดประเมินต้องห่างกันอย่างน้อย 1 ชั่วโมง";
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
                formData.start_assessment
                  ? dayjs(formData.start_assessment).add(1, "hour")
                  : formData.end_activity_date
                  ? dayjs(formData.end_activity_date).add(1, "hour")
                  : dayjs()
              }
              value={
                formData.end_assessment
                  ? dayjs(formData.end_assessment)
                  : null
              }
              onChange={(newValue) =>
                handleDateTimeChange("end_assessment", newValue)
              }
              disabled={disabled || !formData.start_assessment || !isEndAssessmentEditable}
              slotProps={{
                textField: {
                  sx: { height: "56px" },
                  error: !!(
                    !disabled &&
                    formData.activity_status === "Public" &&
                    ((formData.end_assessment === null || formData.end_assessment === undefined) ||
                      (formData.end_assessment &&
                        formData.start_assessment &&
                        ((dayjs(formData.end_assessment).isBefore(
                          dayjs(formData.start_assessment),
                        )) ||
                          (formData.end_activity_date &&
                            dayjs(formData.end_assessment).isBefore(
                              dayjs(formData.end_activity_date),
                            )) ||
                          (formData.end_assessment &&
                            formData.start_assessment &&
                            dayjs(formData.end_assessment).diff(
                              dayjs(formData.start_assessment),
                              'hour'
                            ) < 1))))
                  ),
                  helperText:
                    !disabled &&
                    formData.activity_status === "Public"
                      ? (!formData.end_assessment
                          ? "❌ กรุณาเลือกวันและเวลาสิ้นสุดการทำแบบประเมิน"
                          : formData.end_assessment &&
                            formData.start_assessment &&
                            dayjs(formData.end_assessment).isBefore(
                              dayjs(formData.start_assessment),
                            )
                          ? "❌ วันสิ้นสุดประเมินต้องอยู่หลังวันเริ่มประเมิน"
                          : formData.end_assessment &&
                            formData.end_activity_date &&
                            dayjs(formData.end_assessment).isBefore(
                              dayjs(formData.end_activity_date),
                            )
                          ? "❌ วันสิ้นสุดประเมินต้องอยู่หลังวันสิ้นสุดกิจกรรม"
                          : formData.end_assessment &&
                            formData.start_assessment &&
                            dayjs(formData.end_assessment).diff(
                              dayjs(formData.start_assessment),
                              'hour'
                            ) < 1
                          ? "❌ วันเปิดและปิดประเมินต้องห่างกันอย่างน้อย 1 ชั่วโมง"
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
</div>
  );
};

export default AssessmentSection;
