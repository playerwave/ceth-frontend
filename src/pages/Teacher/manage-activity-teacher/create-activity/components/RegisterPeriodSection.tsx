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
  //   <div className="flex flex-col ml-0">
  //     {" "}
  //     {/* ลบ space-y-6 ออก */}
  //     <div className="flex flex-col w-77.5">
  //       <label className="block font-semibold mb-1">
  //         วันที่ลงทะเบียนพิเศษ *
  //       </label>
  //       <LocalizationProvider dateAdapter={AdapterDayjs}>
  //         <DateTimePicker
  //           minDate={dayjs()}
  //           value={
  //             formData.end_register_date ? dayjs(formData.end_register_date) : null
  //           }
  //           onChange={(newValue) =>
  //             handleDateTimeChange("end_register_date", newValue)
  //           }
  //           sx={{ height: "56px" }}
  //         />
  //       </LocalizationProvider>
  //     </div>
  //     {/* <div className="flex flex-col w-77.5 mt-9">
  //       {" "}
  //       <label className="block font-semibold">
  //         วันและเวลาเปิดให้นิสิตลงทะเบียน *
  //       </label>
  //       <LocalizationProvider dateAdapter={AdapterDayjs}>
  //         <DateTimePicker
  //           minDate={dayjs().add(1, "day")}
  //           value={
  //             formData.start_register_date
  //               ? dayjs(formData.start_register_date)
  //               : null
  //           }
  //           onChange={(newValue) =>
  //             handleDateTimeChange("start_register_date", newValue)
  //           }
  //           slotProps={{
  //             textField: {
  //               sx: { height: "56px" },
  //               error: !!(
  //                 formData.activity_status !== "Private" &&
  //                 formData.start_register_date &&
  //                 formData.end_register_date &&
  //                 (dayjs(formData.start_register_date).isBefore(
  //                   dayjs().startOf("day"),
  //                 ) ||
  //                   dayjs(formData.start_register_date).isAfter(
  //                     dayjs(formData.end_register_date),
  //                   ) ||
  //                   dayjs(formData.start_register_date).isSame(
  //                     dayjs(formData.end_register_date),
  //                     "day",
  //                   ))
  //               ),
  //               helperText:
  //                 formData.activity_status !== "Private" &&
  //                 formData.start_register_date &&
  //                 formData.end_register_date &&
  //                 (dayjs(formData.start_register_date).isBefore(
  //                   dayjs().startOf("day"),
  //                 ) ||
  //                   dayjs(formData.start_register_date).isAfter(
  //                     dayjs(formData.end_register_date),
  //                   ) ||
  //                   dayjs(formData.start_register_date).isSame(
  //                     dayjs(formData.end_register_date),
  //                     "day",
  //                   ))
  //                   ? "วันเปิดให้นิสิตสถานะ normal ลงทะเบียน ต้องอยู่หลังวันนี้ และไม่ตรงกับหรือเลยวันปิดลงทะเบียน"
  //                   : "",
  //             },
  //           }}
  //         />
  //       </LocalizationProvider>
  //     </div>
  //      <p className="text-xs text-gray-500 mt-1">Start</p> */}

  //      <div className="grid grid-cols-1 gap-2 w-full mt-9">
  //       <div>
  //       <label className="block font-semibold mb-1">
  //     วันและเวลาที่เปิดลงทะเบียน *
  //   </label>
  // {/* Start Register Date */}
  // <div className="flex space-x-2 w-full">
  //   <div className="w-1/2">
  //           <div className="flex flex-col">
  //   <LocalizationProvider dateAdapter={AdapterDayjs}>
  //     <DateTimePicker
  //       minDate={dayjs().add(1, "day")}
  //       value={
  //         formData.start_register_date
  //           ? dayjs(formData.start_register_date)
  //           : null
  //       }
  //       onChange={(newValue) =>
  //         handleDateTimeChange("start_register_date", newValue)
  //       }
  //       slotProps={{
  //         textField: {
  //           sx: { height: "56px" },
  //           error: !!(
  //             formData.activity_status !== "Private" &&
  //             formData.start_register_date &&
  //             formData.end_register_date &&
  //             (dayjs(formData.start_register_date).isBefore(
  //               dayjs().startOf("day"),
  //             ) ||
  //               dayjs(formData.start_register_date).isAfter(
  //                 dayjs(formData.end_register_date),
  //               ) ||
  //               dayjs(formData.start_register_date).isSame(
  //                 dayjs(formData.end_register_date),
  //                 "day",
  //               ))
  //           ),
  //           helperText:
  //             formData.activity_status !== "Private" &&
  //             formData.start_register_date &&
  //             formData.end_register_date &&
  //             (dayjs(formData.start_register_date).isBefore(
  //               dayjs().startOf("day"),
  //             ) ||
  //               dayjs(formData.start_register_date).isAfter(
  //                 dayjs(formData.end_register_date),
  //               ) ||
  //               dayjs(formData.start_register_date).isSame(
  //                 dayjs(formData.end_register_date),
  //                 "day",
  //               ))
  //               ? "วันเปิดลงทะเบียนต้องอยู่หลังวันนี้และไม่ตรง/หลังวันปิด"
  //               : "",
  //         },
  //       }}
  //     />
  //   </LocalizationProvider>
  //   </div>
  //   </div>
  //   <p className="text-xs text-gray-500 mt-1">Start</p>
  // </div>

  // <span className="self-center font-semibold">-</span>

  // {/* End Register Date */}
  // <div className="flex space-x-2 w-full">

  //   <div className="w-1/2">
  //           <div className="flex flex-col">
  //   <LocalizationProvider dateAdapter={AdapterDayjs}>
  //     <DateTimePicker
  //       value={
  //         formData.end_register_date
  //           ? dayjs(formData.end_register_date)
  //           : null
  //       }
  //       onChange={(newValue) =>
  //         handleDateTimeChange("end_register_date", newValue)
  //       }
  //       slotProps={{
  //         textField: {
  //           sx: { height: "56px" },
  //           error: false,
  //           helperText: "",
  //         },
  //       }}
  //     />
  //   </LocalizationProvider>

  // </div>
  // <p className="text-xs text-gray-500 mt-1">Start</p>
  // </div>
 


  // </div>
  //   </div>
  //   </div>
  //   </div>

<div className="flex flex-col ml-0">
      {" "}
      <div className="flex flex-col w-77.5">
  <label className="block font-semibold mb-1">
    วันที่ลงทะเบียนพิเศษ *
  </label>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DateTimePicker
      minDate={dayjs()}
      value={
        formData.special_start_register_date
          ? dayjs(formData.special_start_register_date)
          : null
      }
      onChange={(newValue) =>
        handleDateTimeChange("special_start_register_date", newValue)
      }
      slotProps={{
        textField: {
          sx: { height: "56px" },
          error: !!(
            formData.special_start_register_date &&
            formData.start_register_date &&
            dayjs(formData.special_start_register_date).isAfter(
              dayjs(formData.start_register_date),
            )
          ),
          helperText:
            formData.special_start_register_date &&
            formData.start_register_date &&
            dayjs(formData.special_start_register_date).isAfter(
              dayjs(formData.start_register_date),
            )
              ? "❌ วันลงทะเบียนพิเศษต้องอยู่ก่อนวันลงทะเบียนปกติ"
              : "",
        },
      }}
      disabled={false}
    />
  </LocalizationProvider>
</div>

  <div className="grid grid-cols-1 gap-2 w-full mt-9">
  <div>
    <label className="block font-semibold">
      วันและเวลาเปิดและปิดลงทะเบียนกิจกรรม *
    </label>
    <div className="flex space-x-2 w-full">
      {/* Start */}
      <div className="w-1/2">
        <div className="flex flex-col">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className="w-77.5"
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
                      ? "❌ วันเปิดให้นิสิตลงทะเบียนต้องอยู่หลังวันนี้และไม่ตรงกับวันปิด"
                      : "",
                },
              }}
              disabled={!formData.special_start_register_date}
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
              minDate={dayjs(formData.start_register_date)}
              value={
                formData.end_register_date
                  ? dayjs(formData.end_register_date)
                  : null
              }
              onChange={(newValue) =>
                handleDateTimeChange("end_register_date", newValue)
              }
              slotProps={{
                textField: {
                  sx: { height: "56px" },
                  error: !!(
                    formData.activity_status !== "Private" &&
                    formData.end_register_date &&
                    formData.start_register_date &&
                    dayjs(formData.end_register_date).isBefore(
                      dayjs(formData.start_register_date),
                    )
                  ),
                  helperText:
                    formData.activity_status !== "Private" &&
                    formData.end_register_date &&
                    formData.start_register_date &&
                    dayjs(formData.end_register_date).isBefore(
                      dayjs(formData.start_register_date),
                    )
                      ? "❌ วันปิดต้องอยู่หลังวันเปิดลงทะเบียน"
                      : "",
                },
              }}
              disabled={!formData.start_register_date}
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
