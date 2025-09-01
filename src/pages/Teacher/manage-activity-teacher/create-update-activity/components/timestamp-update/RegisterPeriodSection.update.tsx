// components/AdminActivityForm/RegisterPeriodSection.update.tsx
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { CreateActivityForm } from "../../create_activity_admin";
import { convertBackendTimeToLocal } from "../../utils/timeUtils";

// ————— Constants & small utils —————
const MIN_DIFF_MINUTES = 60;
type D = dayjs.Dayjs | null;

// ✅ แปลง UTC time จาก backend เป็น local time
const d = (v?: string | null): D =>
  v ? convertBackendTimeToLocal(v) : null;

const isAfter = (a: D, b: D): boolean => !!(a && b && a.isAfter(b));
const isSame = (a: D, b: D): boolean => !!(a && b && a.isSame(b));
const isBefore = (a: D, b: D): boolean => !!(a && b && a.isBefore(b));
const diffMinutes = (a: D, b: D): number | null => (a && b ? a.diff(b, "minute") : null);
const ltMinutes = (a: D, b: D, minutes: number): boolean => {
  const diff = diffMinutes(a, b);
  return diff !== null ? diff < minutes : false;
};

// ————— Types —————
type RegisterFormSlice = Pick<
  CreateActivityForm,
  | "activity_status"
  | "event_format"
  | "special_start_register_date"
  | "start_register_date"
  | "end_register_date"
>;

interface Props {
  formData: RegisterFormSlice;
  handleDateTimeChange: (name: string, newValue: dayjs.Dayjs | null) => void;
  disabled?: boolean;
  isEditMode?: boolean;
  backendActivityStatus?: string;
  // ✅ Props สำหรับจำกัดการแก้ไขเฉพาะ field ใน update mode
  isSpecialStartRegisterDateEditable?: boolean;
  isStartRegisterDateEditable?: boolean;
  isEndRegisterDateEditable?: boolean;
}

interface StartValidateInput {
  disabled: boolean;
  isPublic: boolean;
  isOnsiteOrOnline: boolean;
  start: D;
  end: D;
  special: D;
}

interface ValidateResult {
  error: boolean;
  helperText: string;
}

// ————— Start field validation สำหรับ update mode —————
const validateStartRegisterUpdate = ({
  disabled,
  isPublic,
  isOnsiteOrOnline,
  start,
  end,
  special,
  isEditMode = true, // ✅ เปลี่ยนเป็น true สำหรับ update mode
}: StartValidateInput & { isEditMode?: boolean }): ValidateResult => {
  if (disabled || !isPublic || !start) return { error: false, helperText: "" };

  // ✅ ถ้าเป็นหน้าแก้ไข ไม่ต้องเช็ค error "วันเปิดให้นิสิตลงทะเบียนต้องอยู่หลังวันนี้"
  if (!isEditMode && isBefore(start, dayjs())) {
    return { error: true, helperText: "วันเปิดให้นิสิตลงทะเบียนต้องอยู่หลังวันนี้" };
  }

  if (end) {
    if (isAfter(start, end)) {
      return { error: true, helperText: "วันเปิดลงทะเบียนต้องอยู่ก่อนวันปิดลงทะเบียน" };
    }
    if (isSame(start, end)) {
      return { error: true, helperText: "วันเปิดและวันปิดลงทะเบียนต้องไม่ตรงกัน" };
    }
    if (ltMinutes(end, start, MIN_DIFF_MINUTES)) {
      return { error: true, helperText: "วันเปิดและวันปิดลงทะเบียนต้องห่างกันอย่างน้อย 1 ชั่วโมง" };
    }
  }

  // ✅ กฎใหม่: Public + Onsite/Online → start ต้องห่าง special ≥ 60 นาที (ไม่ต้องรอให้ end ถูกกรอก)
  if (isOnsiteOrOnline && special && ltMinutes(start, special, MIN_DIFF_MINUTES)) {
    return { error: true, helperText: "วันและเวลาเปิดลงทะเบียนต้องห่างจากวันลงทะเบียนพิเศษอย่างน้อย 1 ชั่วโมง" };
  }

  return { error: false, helperText: "" };
};

// ————— Component สำหรับ update mode —————
const RegisterPeriodSectionUpdate: React.FC<Props> = ({
  formData,
  handleDateTimeChange,
  disabled = false,
  isEditMode = true, // ✅ เปลี่ยนเป็น true สำหรับ update mode
  isSpecialStartRegisterDateEditable = true,
  isStartRegisterDateEditable = true,
  isEndRegisterDateEditable = true,
}) => {
  const isPublic = formData.activity_status === "Public";
  const isOnsiteOrOnline =
    formData.event_format === "Onsite" || formData.event_format === "Online";

  // 👉 ใช้ค่าที่แปลงเป็น local แล้วเสมอ
  const start = d(formData.start_register_date);
  const end = d(formData.end_register_date);
  const special = d(formData.special_start_register_date);

  const startVal = validateStartRegisterUpdate({
    disabled,
    isPublic,
    isOnsiteOrOnline,
    start,
    end,
    special,
    isEditMode, // ✅ ส่ง isEditMode ไปยัง validation function
  });

  return (
    <div className="flex flex-col ml-0">
      {/* ——— ส่วน "วันที่ลงทะเบียนพิเศษ" สำหรับ update mode ——— */}
      <div className="flex flex-col w-77.5">
        <label className="block font-semibold mb-1">วันที่ลงทะเบียนพิเศษ *</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            // ✅ สำหรับ update mode: ไม่ต้องห้ามเลือกอดีต
            minDate={isEditMode ? undefined : dayjs()}
            // แปลงเป็น local แล้วค่อยสร้าง dayjs (เราเตรียม special ด้านบนแล้ว)
            value={special}
            onChange={(nv) => handleDateTimeChange("special_start_register_date", nv)}
            disabled={disabled || !isSpecialStartRegisterDateEditable}
            slotProps={{
              textField: {
                sx: { height: "56px" },
                error: (() => {
                  if (disabled || !isPublic || !special) return false;
                  // ✅ ถ้าเป็นหน้าแก้ไข ไม่ต้องเช็ค error "วันลงทะเบียนพิเศษต้องไม่เป็นอดีต"
                  if (!isEditMode && isBefore(special, dayjs())) return true;
                  // 2) ถ้าเป็น Public + Onsite/Online → ต้องก่อน start อย่างน้อย 1 ชม. (เมื่อเลือก start แล้ว)
                  if (isOnsiteOrOnline && start && ltMinutes(start, special, MIN_DIFF_MINUTES)) return true;
                  return false;
                })(),
                helperText: (() => {
                  if (disabled || !isPublic || !special) return "";
                  if (!isEditMode && isBefore(special, dayjs())) {
                    return "วันลงทะเบียนพิเศษต้องไม่เป็นอดีต";
                  }
                  if (isOnsiteOrOnline && start && ltMinutes(start, special, MIN_DIFF_MINUTES)) {
                    return "วันและเวลาลงทะเบียนพิเศษต้องอยู่ก่อนวันเปิดลงทะเบียนอย่างน้อย 1 ชั่วโมง";
                  }
                  return "";
                })(),
              },
            }}
          />
        </LocalizationProvider>
      </div>

      <div className="grid grid-cols-1 gap-2 w-full mt-9">
        <div>
          <label className="block font-semibold">วันและเวลาเปิดและปิดลงทะเบียนกิจกรรม *</label>

          <div className="flex space-x-2 w-full">
            {/* Start */}
            <div className="w-1/2">
              <div className="flex flex-col">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    className="w-77.5"
                    // ✅ สำหรับ update mode: ไม่ต้องห้ามเลือกอดีต
                    minDate={(isPublic && isOnsiteOrOnline && special) ? special.add(1, "hour") : (isEditMode ? undefined : dayjs())}
                    value={start}
                    onChange={(nv) => handleDateTimeChange("start_register_date", nv)}
                    disabled={disabled || !special || !isStartRegisterDateEditable}
                    slotProps={{
                      textField: {
                        sx: { height: "56px" },
                        error: startVal.error,
                        helperText: startVal.error ? startVal.helperText : "",
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
                    minDate={start ?? (isEditMode ? undefined : dayjs())}
                    value={end}
                    onChange={(nv) => handleDateTimeChange("end_register_date", nv)}
                    disabled={disabled || !start || !isEndRegisterDateEditable}
                    slotProps={{
                      textField: {
                        sx: { height: "56px" },
                        error: !!(
                          !disabled &&
                          isPublic &&
                          end &&
                          start &&
                          (isBefore(end, start) || isSame(end, start) || ltMinutes(end, start, MIN_DIFF_MINUTES))
                        ),
                        helperText:
                          !disabled &&
                          isPublic &&
                          end &&
                          start &&
                          (isBefore(end, start) || isSame(end, start) || ltMinutes(end, start, MIN_DIFF_MINUTES))
                            ? isBefore(end, start)
                              ? "วันปิดลงทะเบียนต้องอยู่หลังวันเปิดลงทะเบียน"
                              : isSame(end, start)
                              ? "วันเปิดและวันปิดลงทะเบียนต้องไม่ตรงกัน"
                              : "วันเปิดและวันปิดลงทะเบียนต้องห่างกันอย่างน้อย 1 ชั่วโมง"
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
    </div>
  );
};

export default RegisterPeriodSectionUpdate;
