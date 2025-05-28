// import { useState } from "react";
// import { toast } from "sonner";
// import Button from "../../../../../components/Button";
// import { Calendar, CalendarDays, Clock, Play } from "lucide-react";
// import ConfirmModal from "./ConfirmModal";

// interface Props {
//   activity: any;
//   isEnrolled: boolean;
//   enrollActivity: any;
//   unenrollActivity: any;
//   setIsEnrolled: React.Dispatch<React.SetStateAction<boolean>>;
//   navigate: any;
//   enrolledActivities: any[];
//   selectedFood: string;
// }

// export default function ActivityFooter({
//   activity,
//   isEnrolled,
//   enrollActivity,
//   unenrollActivity,
//   setIsEnrolled,
//   navigate,
//   enrolledActivities,
//   selectedFood,
// }: Props) {
//   const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
//   const [isUnEnrollModalOpen, setIsUnEnrollModalOpen] = useState(false);

//   const handleEnroll = async () => {
//     const userId = 8;
//     if (!userId) {
//       toast.error("❌ ไม่พบข้อมูลผู้ใช้");
//       return;
//     }

//     if (
//       activity.food &&
//       activity.food.length > 0 &&
//       !selectedFood &&
//       activity.location_type === "Onsite"
//     ) {
//       toast.error("❌ กรุณาเลือกอาหารก่อนลงทะเบียน");
//       return;
//     }

//     const hasTimeConflict = enrolledActivities.some((act) => {
//       if (
//         activity.location_type === "Course" ||
//         act.ac_location_type === "Course"
//       ) {
//         return false;
//       }
//       const existingStart = new Date(act.ac_start_time).getTime();
//       const existingEnd = new Date(act.ac_end_time).getTime();
//       const newStart = new Date(activity.start_time).getTime();
//       const newEnd = new Date(activity.end_time).getTime();
//       return (
//         (newStart >= existingStart && newStart < existingEnd) ||
//         (newEnd > existingStart && newEnd <= existingEnd) ||
//         (newStart <= existingStart && newEnd >= existingEnd)
//       );
//     });

//     if (hasTimeConflict) {
//       toast.error(
//         "ไม่สามารถลงทะเบียนได้: เวลากิจกรรมนี้ทับซ้อนกับกิจกรรมอื่นที่คุณลงทะเบียนเอาไว้แล้ว"
//       );
//       return;
//     }

//     await enrollActivity(userId, activity.id, selectedFood);
//     setIsEnrolled(true);
//     navigate("/list-activity-student");
//   };

//   const handleUnenroll = async () => {
//     const userId = 8;
//     if (!userId) {
//       toast.error("❌ ไม่พบข้อมูลผู้ใช้");
//       return;
//     }
//     await unenrollActivity(userId, activity.id);
//     setIsEnrolled(false);
//     navigate("/main-student");
//   };

//   const formatTime = (date: Date) => {
//     let hours = date.getHours();
//     let minutes = date.getMinutes();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     const displayHours = hours % 12 || 12;

//     const formattedHours =
//       displayHours === 12 ? "12" : displayHours.toString().padStart(2, "0");

//     const formattedMinutes = minutes.toString().padStart(2, "0");

//     return `${formattedHours}:${formattedMinutes} ${ampm}`;
//   };

//   const formatDateTime = (date: Date) => {
//     return (
//       date.toLocaleDateString("th-TH", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       }) + ` (${formatTime(date)})`
//     );
//   };

//   return (
//     <>
//       <ConfirmModal
//         activity={activity} // ✅ ส่งเข้าไป
//         isEnrolled={isEnrolled}
//         isEnrollModalOpen={isEnrollModalOpen}
//         setIsEnrollModalOpen={setIsEnrollModalOpen}
//         isUnEnrollModalOpen={isUnEnrollModalOpen}
//         setIsUnEnrollModalOpen={setIsUnEnrollModalOpen}
//         activityEndRegister={activity.end_register}
//         onConfirmEnroll={handleEnroll}
//         onConfirmUnenroll={handleUnenroll}
//       />

//       <div className="flex flex-wrap items-center justify-between gap-2 text-[14px] mt-1">
//         <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto font-[Sarabun] font-semibold">
//           <div className="flex items-center gap-1 font-[Sarabun] font-semibold">
//             <Clock size={25} />
//             {activity.start_time
//               ? formatTime(new Date(activity.start_time))
//               : "ไม่ระบุ"}{" "}
//             -{" "}
//             {activity.end_time
//               ? formatTime(new Date(activity.end_time))
//               : "ไม่ระบุ"}
//           </div>

//           <div className="flex items-center gap-1 font-[Sarabun] font-semibold">
//             <Play size={25} />
//             {activity.state}
//           </div>

//           <div className="block sm:hidden flex items-center gap-1 font-[Sarabun] font-semibold">
//             <CalendarDays size={20} />
//             {activity.start_time &&
//               activity.end_time &&
//               `${formatDateTime(
//                 new Date(activity.start_time)
//               )} - ${formatDateTime(new Date(activity.end_time))}`}
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-between lg:justify-end">
//           <Button onClick={() => window.history.back()}>← กลับ</Button>

//           {isEnrolled ? (
//             <Button bgColor="red" onClick={() => setIsUnEnrollModalOpen(true)}>
//               ยกเลิกลงทะเบียน
//             </Button>
//           ) : (
//             <Button onClick={() => setIsEnrollModalOpen(true)}>
//               ลงทะเบียน
//             </Button>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

import { useState } from "react";
import { toast } from "sonner";
import Button from "../../../../../components/Button";
import { CalendarDays, Clock, Play } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import Dialog1 from "../../../../../components/Dialog1"; // ✅ import Dialog1

interface Props {
  activity: any;
  isEnrolled: boolean;
  enrollActivity: any;
  unenrollActivity: any;
  setIsEnrolled: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: any;
  enrolledActivities: any[];
  selectedFood: string;
}

export default function ActivityFooter({
  activity,
  isEnrolled,
  enrollActivity,
  unenrollActivity,
  setIsEnrolled,
  navigate,
  enrolledActivities,
  selectedFood,
}: Props) {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isUnEnrollModalOpen, setIsUnEnrollModalOpen] = useState(false);
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false); // ✅ state สำหรับ Dialog1

  const handleEnroll = async () => {
    const userId = 8;
    if (!userId) {
      toast.error("❌ ไม่พบข้อมูลผู้ใช้");
      return;
    }

    if (
      activity.food &&
      activity.food.length > 0 &&
      !selectedFood &&
      activity.location_type === "Onsite"
    ) {
      toast.error("❌ กรุณาเลือกอาหารก่อนลงทะเบียน");
      return;
    }

    const hasTimeConflict = enrolledActivities.some((act) => {
      if (
        activity.location_type === "Course" ||
        act.ac_location_type === "Course"
      ) {
        return false;
      }
      const existingStart = new Date(act.ac_start_time).getTime();
      const existingEnd = new Date(act.ac_end_time).getTime();
      const newStart = new Date(activity.start_time).getTime();
      const newEnd = new Date(activity.end_time).getTime();
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });

    if (hasTimeConflict) {
      setConflictDialogOpen(true); // ✅ แสดง dialog แทน toast
      return;
    }

    await enrollActivity(userId, activity.id, selectedFood);
    setIsEnrolled(true);
    navigate("/list-activity-student");
  };

  const handleUnenroll = async () => {
    const userId = 8;
    if (!userId) {
      toast.error("❌ ไม่พบข้อมูลผู้ใช้");
      return;
    }
    await unenrollActivity(userId, activity.id);
    setIsEnrolled(false);
    navigate("/main-student");
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    const formattedHours =
      displayHours === 12 ? "12" : displayHours.toString().padStart(2, "0");

    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const formatDateTime = (date: Date) => {
    return (
      date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) + ` (${formatTime(date)})`
    );
  };

  return (
    <>
      <ConfirmModal
        activity={activity}
        isEnrolled={isEnrolled}
        isEnrollModalOpen={isEnrollModalOpen}
        setIsEnrollModalOpen={setIsEnrollModalOpen}
        isUnEnrollModalOpen={isUnEnrollModalOpen}
        setIsUnEnrollModalOpen={setIsUnEnrollModalOpen}
        activityEndRegister={activity.end_register}
        onConfirmEnroll={handleEnroll}
        onConfirmUnenroll={handleUnenroll}
      />

      <Dialog1
  open={conflictDialogOpen}
  onClose={() => {
    setConflictDialogOpen(false);
    setIsEnrollModalOpen(false); // หรือ setIsUnEnrollModalOpen(false) ตาม context
  }}
  title="ไม่สามารถลงทะเบียนได้"
  message="เวลากิจกรรมนี้ทับซ้อนกับกิจกรรมอื่นที่คุณลงทะเบียนเอาไว้แล้ว"
/>


      <div className="flex flex-wrap items-center justify-between gap-2 text-[14px] mt-1">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto font-[Sarabun] font-semibold">
          <div className="flex items-center gap-1 font-[Sarabun] font-semibold">
            <Clock size={25} />
            {activity.start_time
              ? formatTime(new Date(activity.start_time))
              : "ไม่ระบุ"} -
            {activity.end_time
              ? formatTime(new Date(activity.end_time))
              : "ไม่ระบุ"}
          </div>

          <div className="flex items-center gap-1 font-[Sarabun] font-semibold">
            <Play size={25} />
            {activity.state}
          </div>

          <div className="block sm:hidden flex items-center gap-1 font-[Sarabun] font-semibold">
            <CalendarDays size={20} />
            {activity.start_time &&
              activity.end_time &&
              `${formatDateTime(
                new Date(activity.start_time)
              )} - ${formatDateTime(new Date(activity.end_time))}`}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <Button onClick={() => window.history.back()}>← กลับ</Button>

          {isEnrolled ? (
            <Button bgColor="red" onClick={() => setIsUnEnrollModalOpen(true)}>
              ยกเลิกลงทะเบียน
            </Button>
          ) : (
            <Button onClick={() => setIsEnrollModalOpen(true)}>
              ลงทะเบียน
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
