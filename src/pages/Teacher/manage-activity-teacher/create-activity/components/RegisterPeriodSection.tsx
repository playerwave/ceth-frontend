// // components/AdminActivityForm/RegisterPeriodSection.tsx
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import dayjs, { Dayjs } from "dayjs";
// import { CreateActivityForm } from "../create_activity_admin";
// import { convertBackendTimeToLocal, convertToLocalTimeForPicker } from "../utils/timeUtils";

// interface Props {
//   formData: CreateActivityForm;
//   handleDateTimeChange: (name: string, newValue: Dayjs | null) => void;
//   disabled?: boolean;
//   isEditMode?: boolean;
//   backendActivityStatus?: string; // ✅ เพิ่ม prop สำหรับ backend activity status
// }

// const RegisterPeriodSection: React.FC<Props> = ({
//   formData,
//   handleDateTimeChange,
//   disabled = false,
//   isEditMode = false,
//   backendActivityStatus = "",

  
// }) => {
//   const isPublic = formData.activity_status === "Public";
//   const isOnsiteOrOnline = formData.event_format === "Onsite" || formData.event_format === "Online";

//   return (
// <div className="flex flex-col ml-0">
//       {" "}
//       <div className="flex flex-col w-77.5">
//   <label className="block font-semibold mb-1">
//     วันที่ลงทะเบียนพิเศษ *
//   </label>
//   <LocalizationProvider dateAdapter={AdapterDayjs}>
//     <DateTimePicker
//       minDate={dayjs()}
//       value={
//         formData.special_start_register_date
//           ? dayjs(formData.special_start_register_date)
//           : null
//       }
//       onChange={(newValue) =>
//         handleDateTimeChange("special_start_register_date", newValue)
//       }
//       disabled={disabled}
//       slotProps={{
//         textField: {
//           sx: { height: "56px" },
//                             error: !!(
//                     !disabled && // ✅ ไม่แสดง error ถ้า field ถูก disable
//                     formData.activity_status === "Public" &&
//                     formData.special_start_register_date &&
//                     (dayjs(formData.special_start_register_date)?.isBefore(
//                       dayjs(),
//                     ) ||
//                     (formData.start_register_date &&
//                       dayjs(formData.special_start_register_date)?.isAfter(
//                         dayjs(formData.start_register_date),
//                       ))) &&
//                     // ✅ แสดง error เฉพาะเมื่อ backend เป็น Private แต่ field เป็น Public
//                     backendActivityStatus === "Private"
//                   ),
//                   helperText:
//                     !disabled && // ✅ ไม่แสดง error ถ้า field ถูก disable
//                     formData.activity_status === "Public" &&
//                     formData.special_start_register_date &&
//                     (dayjs(formData.special_start_register_date)?.isBefore(
//                       dayjs(),
//                     ) &&
//                     // ✅ แสดง error เฉพาะเมื่อ backend เป็น Private แต่ field เป็น Public
//                     backendActivityStatus === "Private"
//                       ? "❌ วันลงทะเบียนพิเศษต้องไม่เป็นอดีต"
//                       : formData.start_register_date &&
//                         dayjs(formData.special_start_register_date)?.isAfter(
//                           dayjs(formData.start_register_date),
//                         ) &&
//                         // ✅ แสดง error เฉพาะเมื่อ backend เป็น Private แต่ field เป็น Public
//                         backendActivityStatus === "Private"
//                         ? "❌ วันลงทะเบียนพิเศษต้องอยู่ก่อนวันลงทะเบียนปกติ"
//                         : ""),
//         },
//       }}
//     />
//   </LocalizationProvider>
// </div>

//   <div className="grid grid-cols-1 gap-2 w-full mt-9">
//   <div>
//     <label className="block font-semibold">
//       วันและเวลาเปิดและปิดลงทะเบียนกิจกรรม *
//     </label>
//     <div className="flex space-x-2 w-full">
//   {/* Start */}
//   <div className="w-1/2">
//     <div className="flex flex-col">
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <DateTimePicker
//           className="w-77.5"
//           minDate={dayjs().add(1, "day")}
//           value={
//             formData.start_register_date
//               ? dayjs(formData.start_register_date)
//               : null
//           }
//           onChange={(newValue) =>
//             handleDateTimeChange("start_register_date", newValue)
//           }
//           disabled={disabled || !formData.special_start_register_date}
//           slotProps={{
//             textField: {
//               sx: { height: "56px" },
//               error: !!(
//   !disabled &&
//   isPublic &&
//   formData.start_register_date &&
//   formData.end_register_date &&
//   (
//     dayjs(formData.start_register_date).isBefore(dayjs()) ||
//     dayjs(formData.start_register_date).isAfter(dayjs(formData.end_register_date)) ||
//     dayjs(formData.start_register_date).isSame(dayjs(formData.end_register_date)) ||
//     // ต้องห่าง end ≥ 1 ชั่วโมง (เดิมมีแล้ว)
//     dayjs(formData.end_register_date).diff(dayjs(formData.start_register_date), 'hour') < 1 ||
//     // 🔴 กฎใหม่: ถ้า Public + Onsite/Online ต้องห่างจาก special ≥ 1 ชั่วโมง
//     (
//       isOnsiteOrOnline &&
//       formData.special_start_register_date &&
//       dayjs(formData.start_register_date).diff(dayjs(formData.special_start_register_date), 'minute') < 60
//     )
//   )
// ),
// helperText:
//   !disabled &&
//   isPublic &&
//   formData.start_register_date &&
//   formData.end_register_date &&
//   (
//     dayjs(formData.start_register_date).isBefore(dayjs()) ||
//     dayjs(formData.start_register_date).isAfter(dayjs(formData.end_register_date)) ||
//     dayjs(formData.start_register_date).isSame(dayjs(formData.end_register_date)) ||
//     dayjs(formData.end_register_date).diff(dayjs(formData.start_register_date), 'hour') < 1 ||
//     (
//       isOnsiteOrOnline &&
//       formData.special_start_register_date &&
//       dayjs(formData.start_register_date).diff(dayjs(formData.special_start_register_date), 'minute') < 60
//     )
//   )
//     ? (
//         dayjs(formData.start_register_date).isBefore(dayjs())
//           ? "❌ วันเปิดให้นิสิตลงทะเบียนต้องอยู่หลังวันนี้"
//           : dayjs(formData.start_register_date).isAfter(dayjs(formData.end_register_date))
//           ? "❌ วันเปิดลงทะเบียนต้องอยู่ก่อนวันปิดลงทะเบียน"
//           : dayjs(formData.start_register_date).isSame(dayjs(formData.end_register_date))
//           ? "❌ วันเปิดและวันปิดลงทะเบียนต้องไม่ตรงกัน"
//           : dayjs(formData.end_register_date).diff(dayjs(formData.start_register_date), 'hour') < 1
//           ? "❌ วันเปิดและวันปิดลงทะเบียนต้องห่างกันอย่างน้อย 1 ชั่วโมง"
//           : "❌ วันเปิดลงทะเบียนต้องห่างจากวันลงทะเบียนพิเศษอย่างน้อย 1 ชั่วโมง"
//       )
//     : "",
//             },
//           }}
//         />
//       </LocalizationProvider>
//     </div>
//     <p className="text-xs text-gray-500 mt-1">Start</p>
//   </div>

//   <span className="self-center font-semibold">-</span>

//   {/* End */}
//   <div className="w-1/2">
//     <div className="flex flex-col">
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <DateTimePicker
//           className="w-77.5"
//           minDate={formData.start_register_date ? dayjs(formData.start_register_date) : dayjs()}
//           value={
//             formData.end_register_date
//               ? dayjs(formData.end_register_date)
//               : null
//           }
//           onChange={(newValue) =>
//             handleDateTimeChange("end_register_date", newValue)
//           }
//           disabled={disabled || !formData.start_register_date}
//           slotProps={{
//             textField: {
//               sx: { height: "56px" },
//               error: !!(
//                 !disabled && // ✅ ไม่แสดง error ถ้า field ถูก disable
//                 formData.activity_status === "Public" &&
//                 formData.end_register_date &&
//                 formData.start_register_date &&
//                 (dayjs(formData.end_register_date)?.isBefore(
//                   dayjs(formData.start_register_date),
//                 ) ||
//                 dayjs(formData.end_register_date)?.isSame(
//                   dayjs(formData.start_register_date),
//                 ) ||
//                 // ✅ เพิ่มการตรวจสอบ: วันที่และเวลาต้องห่างกันอย่างน้อย 1 ชั่วโมง
//                 dayjs(formData.end_register_date).diff(
//                   dayjs(formData.start_register_date),
//                   'hour'
//                 ) < 1)
//               ),
//               helperText:
//                 !disabled && // ✅ ไม่แสดง error ถ้า field ถูก disable
//                 formData.activity_status === "Public" &&
//                 formData.end_register_date &&
//                 formData.start_register_date &&
//                 (dayjs(formData.end_register_date)?.isBefore(
//                   dayjs(formData.start_register_date),
//                 ) ||
//                 dayjs(formData.end_register_date)?.isSame(
//                   dayjs(formData.start_register_date),
//                 ) ||
//                 // ✅ เพิ่มการตรวจสอบ: วันที่และเวลาต้องห่างกันอย่างน้อย 1 ชั่วโมง
//                 dayjs(formData.end_register_date).diff(
//                   dayjs(formData.start_register_date),
//                   'hour'
//                 ) < 1)
//                   ? (dayjs(formData.end_register_date)?.isBefore(dayjs(formData.start_register_date))
//                       ? "❌ วันปิดลงทะเบียนต้องอยู่หลังวันเปิดลงทะเบียน"
//                       : dayjs(formData.end_register_date)?.isSame(dayjs(formData.start_register_date))
//                       ? "❌ วันเปิดและวันปิดลงทะเบียนต้องไม่ตรงกัน"
//                       : dayjs(formData.end_register_date).diff(dayjs(formData.start_register_date), 'hour') < 1
//                       ? "❌ วันเปิดและวันปิดลงทะเบียนต้องห่างกันอย่างน้อย 1 ชั่วโมง"
//                       : "")
//                   : "",
//             },
//           }}
//         />
//       </LocalizationProvider>
//     </div>
//     <p className="text-xs text-gray-500 mt-1">End</p>
//   </div>
// </div>
//   </div>
// </div>
// </div>

//   );
// };

// export default RegisterPeriodSection;

// components/AdminActivityForm/RegisterPeriodSection.tsx
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { CreateActivityForm } from "../create_activity_admin";
import { convertToLocalTimeForPicker } from "../utils/timeUtils";

// ————— Constants & small utils —————
const MIN_DIFF_MINUTES = 60;
type D = dayjs.Dayjs | null;

// ✅ แก้ตรงนี้: แปลงเป็น local ก่อนเสมอแล้วค่อยสร้าง dayjs
const d = (v?: string | null): D =>
  v ? dayjs(convertToLocalTimeForPicker(v)) : null;

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

// ————— Start field validation —————
const validateStartRegister = ({
  disabled,
  isPublic,
  isOnsiteOrOnline,
  start,
  end,
  special,
}: StartValidateInput): ValidateResult => {
  if (disabled || !isPublic || !start) return { error: false, helperText: "" };

  if (isBefore(start, dayjs())) {
    return { error: true, helperText: "❌ วันเปิดให้นิสิตลงทะเบียนต้องอยู่หลังวันนี้" };
  }

  if (end) {
    if (isAfter(start, end)) {
      return { error: true, helperText: "❌ วันเปิดลงทะเบียนต้องอยู่ก่อนวันปิดลงทะเบียน" };
    }
    if (isSame(start, end)) {
      return { error: true, helperText: "❌ วันเปิดและวันปิดลงทะเบียนต้องไม่ตรงกัน" };
    }
    if (ltMinutes(end, start, MIN_DIFF_MINUTES)) {
      return { error: true, helperText: "❌ วันเปิดและวันปิดลงทะเบียนต้องห่างกันอย่างน้อย 1 ชั่วโมง" };
    }
  }

  // ✅ กฎใหม่: Public + Onsite/Online → start ต้องห่าง special ≥ 60 นาที (ไม่ต้องรอให้ end ถูกกรอก)
  if (isOnsiteOrOnline && special && ltMinutes(start, special, MIN_DIFF_MINUTES)) {
    return { error: true, helperText: "❌ วันและเวลาเปิดลงทะเบียนต้องห่างจากวันลงทะเบียนพิเศษอย่างน้อย 1 ชั่วโมง" };
  }

  return { error: false, helperText: "" };
};

// ————— Component —————
const RegisterPeriodSection: React.FC<Props> = ({
  formData,
  handleDateTimeChange,
  disabled = false,
}) => {
  const isPublic = formData.activity_status === "Public";
  const isOnsiteOrOnline =
    formData.event_format === "Onsite" || formData.event_format === "Online";

  // 👉 ใช้ค่าที่แปลงเป็น local แล้วเสมอ
  const start = d(formData.start_register_date);
  const end = d(formData.end_register_date);
  const special = d(formData.special_start_register_date);

  const startVal = validateStartRegister({
    disabled,
    isPublic,
    isOnsiteOrOnline,
    start,
    end,
    special,
  });

  return (
    <div className="flex flex-col ml-0">
      {/* ——— ส่วน "วันที่ลงทะเบียนพิเศษ" ของคุณอยู่ก่อนหน้านี้ ——— */}
      <div className="flex flex-col w-77.5">
  <label className="block font-semibold mb-1">วันที่ลงทะเบียนพิเศษ *</label>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DateTimePicker
      // ห้ามเลือกอดีต
      minDate={dayjs()}
      // แปลงเป็น local แล้วค่อยสร้าง dayjs (เราเตรียม special ด้านบนแล้ว)
      value={special}
      onChange={(nv) => handleDateTimeChange("special_start_register_date", nv)}
      disabled={disabled}
      slotProps={{
        textField: {
          sx: { height: "56px" },
          error: (() => {
            if (disabled || !isPublic || !special) return false;
            // 1) ห้ามเป็นอดีต
            if (isBefore(special, dayjs())) return true;
            // 2) ถ้าเป็น Public + Onsite/Online → ต้องก่อน start อย่างน้อย 1 ชม. (เมื่อเลือก start แล้ว)
            if (isOnsiteOrOnline && start && ltMinutes(start, special, MIN_DIFF_MINUTES)) return true;
            return false;
          })(),
          helperText: (() => {
            if (disabled || !isPublic || !special) return "";
            if (isBefore(special, dayjs())) {
              return "❌ วันลงทะเบียนพิเศษต้องไม่เป็นอดีต";
            }
            if (isOnsiteOrOnline && start && ltMinutes(start, special, MIN_DIFF_MINUTES)) {
              return "❌ วันและเวลาลงทะเบียนพิเศษต้องอยู่ก่อนวันเปิดลงทะเบียนอย่างน้อย 1 ชั่วโมง";
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
                    // ถ้าอยาก UX ดีกว่า: เมื่อมี special และเป็น Public+Onsite/Online
                    // อนุญาตเลือกตั้งแต่ special.add(1, 'hour') เป็นต้นไป
                    minDate={(isPublic && isOnsiteOrOnline && special) ? special.add(1, "hour") : dayjs()}
                    value={start}
                    onChange={(nv) => handleDateTimeChange("start_register_date", nv)}
                    disabled={disabled || !special}
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
                    minDate={start ?? dayjs()}
                    value={end}
                    onChange={(nv) => handleDateTimeChange("end_register_date", nv)}
                    disabled={disabled || !start}
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
                              ? "❌ วันปิดลงทะเบียนต้องอยู่หลังวันเปิดลงทะเบียน"
                              : isSame(end, start)
                              ? "❌ วันเปิดและวันปิดลงทะเบียนต้องไม่ตรงกัน"
                              : "❌ วันเปิดและวันปิดลงทะเบียนต้องห่างกันอย่างน้อย 1 ชั่วโมง"
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

export default RegisterPeriodSection;
