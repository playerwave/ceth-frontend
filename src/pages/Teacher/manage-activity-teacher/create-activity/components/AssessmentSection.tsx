// components/AdminActivityForm/AssessmentSection.tsx
import { MenuItem, Select, SelectChangeEvent, FormHelperText } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { CreateActivityForm } from "../create_activity_admin";
import { Assessment } from "../../../../../types/model";
import { validateField, ValidationMode } from "../utils/form_utils";
import { convertBackendTimeToLocal } from "../utils/timeUtils";

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
  validationMode?: ValidationMode;
  originalActivityStatus?: string;
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
  validationMode = 'create',
  originalActivityStatus,
}) => {
  // ✅ ใช้ validateField function ใหม่
  const startAssessmentValidation = validateField('start_assessment', formData, validationMode, originalActivityStatus);
  const endAssessmentValidation = validateField('end_assessment', formData, validationMode, originalActivityStatus);
  const assessmentIdValidation = validateField('assessment_id', formData, validationMode, originalActivityStatus);

  const endAct = formData.end_activity_date ? convertBackendTimeToLocal(formData.end_activity_date) : null;
  const startAsm = formData.start_assessment ? convertBackendTimeToLocal(formData.start_assessment) : null;

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
      error={assessmentIdValidation.hasError}
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
    {assessmentIdValidation.hasError && (
      <FormHelperText error sx={{ mt: 1 }}>
        {assessmentIdValidation.helperText}
      </FormHelperText>
    )}
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
              minDate={endAct ?? dayjs()}
              value={startAsm ?? null}
              onChange={(newValue) => handleDateTimeChange("start_assessment", newValue)}
              disabled={disabled || !endAct || !isStartAssessmentEditable}
              slotProps={{
                textField: {
                  sx: { height: "56px" },
                  error: startAssessmentValidation.hasError,
                  helperText: startAssessmentValidation.helperText,
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
                  ? convertBackendTimeToLocal(formData.start_assessment)?.add(1, "hour")
                  : formData.end_activity_date
                  ? convertBackendTimeToLocal(formData.end_activity_date)?.add(1, "hour")
                  : dayjs()
              }
              value={
                formData.end_assessment
                  ? convertBackendTimeToLocal(formData.end_assessment)
                  : null
              }
              onChange={(newValue) =>
                handleDateTimeChange("end_assessment", newValue)
              }
              disabled={disabled || !formData.start_assessment || !isEndAssessmentEditable}
              slotProps={{
                textField: {
                  sx: { height: "56px" },
                  error: endAssessmentValidation.hasError,
                  helperText: endAssessmentValidation.helperText,
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
