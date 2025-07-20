// components/AdminActivityForm/AssessmentSection.tsx
import { Box, MenuItem, Select, TextField,SelectChangeEvent } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { CreateActivityForm } from "../create_activity_admin";
import { Assessment } from "../../../../../types/model";

interface Props {
  formData: CreateActivityForm;
  assessments: Assessment[];
  handleChange: (e: SelectChangeEvent<any>) => void;
  handleDateTimeChange: (name: string, newValue: Dayjs | null) => void;
}

const AssessmentSection: React.FC<Props> = ({
  formData,
  assessments,
  handleChange,
  handleDateTimeChange,
}) => {
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
                  minDate={dayjs(formData.start_activity_date)}
                  value={
                    formData.start_assessment
                      ? dayjs(formData.start_assessment)
                      : null
                  }
                  onChange={(newValue) =>
                    handleDateTimeChange("start_assessment", newValue)
                  }
                  slotProps={{
                    textField: {
                      sx: { height: "56px" },
                      error: !!(
                        formData.activity_status === "Public" &&
                        formData.start_assessment &&
                        ((formData.start_activity_date &&
                          dayjs(formData.start_assessment).isBefore(
                            dayjs(formData.start_activity_date),
                          )) ||
                          (formData.end_assessment &&
                            dayjs(formData.start_assessment).isAfter(
                              dayjs(formData.end_assessment),
                            )))
                      ),
                      helperText:
                        formData.activity_status === "Public" &&
                        formData.start_assessment
                          ? formData.start_activity_date &&
                            dayjs(formData.start_assessment).isBefore(
                              dayjs(formData.start_activity_date),
                            )
                            ? "❌ วันเปิดประเมินต้องไม่ก่อนวันเริ่มกิจกรรม"
                            : formData.end_assessment &&
                                dayjs(formData.start_assessment).isAfter(
                                  dayjs(formData.end_assessment),
                                )
                              ? "❌ วันเปิดประเมินต้องอยู่ก่อนวันปิดประเมิน"
                              : ""
                          : "",
                    },
                  }}
                  disabled={!formData.end_activity_date}
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
                  minDate={dayjs(formData.start_assessment)}
                  value={
                    formData.end_assessment
                      ? dayjs(formData.end_assessment)
                      : null
                  }
                  onChange={(newValue) =>
                    handleDateTimeChange("end_assessment", newValue)
                  }
                  slotProps={{
                    textField: {
                      sx: { height: "56px" },
                      // error:
                      //   formData.activity_status === "Public" &&
                      //   formData.end_assessment &&
                      //   formData.start_assessment &&
                      //   dayjs(formData.end_assessment).isBefore(
                      //     dayjs(formData.start_assessment),
                      //   ),
                      error: !!(
  formData.activity_status === "Public" &&
  formData.end_assessment &&
  formData.start_assessment &&
  dayjs(formData.end_assessment).isBefore(dayjs(formData.start_assessment))
),

                      helperText:
                        formData.activity_status === "Public" &&
                        formData.end_assessment &&
                        formData.start_assessment &&
                        dayjs(formData.end_assessment).isBefore(
                          dayjs(formData.start_assessment),
                        )
                          ? "❌ วันสิ้นสุดประเมินต้องอยู่หลังวันเริ่มประเมิน"
                          : "",
                    },
                  }}
                  disabled={!formData.start_assessment}
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
