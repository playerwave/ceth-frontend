// components/AdminActivityForm/AssessmentSection.tsx
import { Box, MenuItem, Select, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  formData: any;
  assessments: any[];
  handleChange: (e: React.ChangeEvent<any>) => void;
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
            return (
              assessments.find((a) => a.as_id === selected)?.as_name || ""
            );
          }}
        >
          <MenuItem disabled value="">
            เลือกเเบบประเมิน
          </MenuItem>
          {assessments && assessments.length > 0 ? (
            assessments.map((assessment) => (
              <MenuItem key={assessment.as_id} value={assessment.as_id}>
                {assessment.as_name}
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
                  minDate={dayjs(formData.ac_start_time)}
                  value={
                    formData.ac_start_assessment
                      ? dayjs(formData.ac_start_assessment)
                      : null
                  }
                  onChange={(newValue) =>
                    handleDateTimeChange("ac_start_assessment", newValue)
                  }
                  slotProps={{
                    textField: {
                      sx: { height: "56px" },
                      error: !!(
                        formData.ac_status === "Public" &&
                        formData.ac_start_assessment &&
                        ((formData.ac_start_time &&
                          dayjs(formData.ac_start_assessment).isBefore(
                            dayjs(formData.ac_start_time)
                          )) ||
                          (formData.ac_end_assessment &&
                            dayjs(formData.ac_start_assessment).isAfter(
                              dayjs(formData.ac_end_assessment)
                            )))
                      ),
                      helperText:
                        formData.ac_status === "Public" &&
                        formData.ac_start_assessment
                          ? formData.ac_start_time &&
                            dayjs(formData.ac_start_assessment).isBefore(
                              dayjs(formData.ac_start_time)
                            )
                            ? "❌ วันเปิดประเมินต้องไม่ก่อนวันเริ่มกิจกรรม"
                            : formData.ac_end_assessment &&
                              dayjs(formData.ac_start_assessment).isAfter(
                                dayjs(formData.ac_end_assessment)
                              )
                            ? "❌ วันเปิดประเมินต้องอยู่ก่อนวันปิดประเมิน"
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
                  minDate={dayjs(formData.ac_start_assessment)}
                  value={
                    formData.ac_end_assessment
                      ? dayjs(formData.ac_end_assessment)
                      : null
                  }
                  onChange={(newValue) =>
                    handleDateTimeChange("ac_end_assessment", newValue)
                  }
                  slotProps={{
                    textField: {
                      sx: { height: "56px" },
                      error:
                        formData.ac_status === "Public" &&
                        formData.ac_end_assessment &&
                        formData.ac_start_assessment &&
                        dayjs(formData.ac_end_assessment).isBefore(
                          dayjs(formData.ac_start_assessment)
                        ),
                      helperText:
                        formData.ac_status === "Public" &&
                        formData.ac_end_assessment &&
                        formData.ac_start_assessment &&
                        dayjs(formData.ac_end_assessment).isBefore(
                          dayjs(formData.ac_start_assessment)
                        )
                          ? "❌ วันสิ้นสุดประเมินต้องอยู่หลังวันเริ่มประเมิน"
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