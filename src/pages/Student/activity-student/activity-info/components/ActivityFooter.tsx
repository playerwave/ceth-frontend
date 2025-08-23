// import { useState } from "react";
// import { toast } from "sonner";
// import Button from "../../../../../components/Button";
// import {
//   Play,
//   StepForward,
//   CalendarHeart,
//   BookCheck,
//   CalendarFold,
//   FileText,
//   CalendarOff,
//   FileCheck,
//   Clock,
// } from "lucide-react";
// import { useAuthStore } from "../../../../../stores/Visitor/auth.store";
// import ActivityDialogs from "./ActivityDialogs";

// interface Props {
//   activity: any;
//   isEnrolled: boolean;
//   enrollActivity: any;
//   unenrollActivity: any;
//   setIsEnrolled: React.Dispatch<React.SetStateAction<boolean>>;
//   navigate: any;
//   enrolledActivities: any[];
//   selectedFood: string;
//   userId?: number;
// }

// const CAN_ENROLL_STATES = ["Open Register", "Special Open"]; // << เงื่อนไขลงทะเบียนได้

// export default function ActivityFooter({
//   activity,
//   isEnrolled,
//   enrollActivity,
//   unenrollActivity,
//   setIsEnrolled,
//   navigate,
//   enrolledActivities,
//   selectedFood,
//   userId,
// }: Props) {
//   const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
//   const [isUnEnrollModalOpen, setIsUnEnrollModalOpen] = useState(false);
//   const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

//   const { user } = useAuthStore();
//   const currentUserId = userId || user?.userId;

//   const handleEnroll = async () => {
//     if (!CAN_ENROLL_STATES.includes(activity.activity_state)) {
//       toast.error("กิจกรรมนี้ไม่อยู่ในช่วงเปิดลงทะเบียน");
//       return;
//     }

//     if (!currentUserId) {
//       toast.error("❌ ไม่พบข้อมูลผู้ใช้");
//       return;
//     }

//     if (
//       activity.activityFood &&
//       activity.activityFood.length > 0 &&
//       !selectedFood &&
//       activity.event_format === "Onsite"
//     ) {
//       toast.error("❌ กรุณาเลือกอาหารก่อนลงทะเบียน");
//       return;
//     }

//     const hasTimeConflict = enrolledActivities.some((act) => {
//       if (activity.event_format === "Course" || act.event_format === "Course") {
//         return false;
//       }
//       const existingStart = new Date(act.start_activity_date).getTime();
//       const existingEnd = new Date(act.end_activity_date).getTime();
//       const newStart = new Date(activity.start_activity_date).getTime();
//       const newEnd = new Date(activity.end_activity_date).getTime();
//       return (
//         (newStart >= existingStart && newStart < existingEnd) ||
//         (newEnd > existingStart && newEnd <= existingEnd) ||
//         (newStart <= existingStart && newEnd >= existingEnd)
//       );
//     });

//     await enrollActivity(currentUserId, activity.activity_id, selectedFood);
//     setIsEnrolled(true);
//     toast.success("✅ ลงทะเบียนกิจกรรมสำเร็จ");
//   };

//   const handleUnenroll = async () => {
//     if (!currentUserId) {
//       toast.error("❌ ไม่พบข้อมูลผู้ใช้");
//       return;
//     }
//     try {
//       await unenrollActivity(currentUserId, activity.activity_id);
//       setIsEnrolled(false);
//       navigate("/main-student");
//       toast.success("✅ ยกเลิกการลงทะเบียนสำเร็จ");
//     } catch (error) {
//       console.error("❌ ยกเลิกการลงทะเบียนไม่สำเร็จ:", error);
//       toast.error("❌ เกิดข้อผิดพลาดในการยกเลิกการลงทะเบียน");
//     }
//   };

//   const formatTime = (date: Date): string =>
//     new Intl.DateTimeFormat("th-TH", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     }).format(date);

//   const getStateIcon = (state: string) => {
//     switch (state) {
//       case "Not Start":
//         return <Play size={25} />;
//       case "Start Activity":
//         return <StepForward size={25} />;
//       case "Special Open":
//         return <CalendarHeart size={25} />;
//       case "End Activity":
//         return <BookCheck size={25} />;
//       case "Open Register":
//         return <CalendarFold size={25} />;
//       case "Start Assessment":
//         return <FileText size={25} />;
//       case "Close Register":
//         return <CalendarOff size={25} />;
//       case "End Assessment":
//         return <FileCheck size={25} />;
//       default:
//         return <Play size={25} />;
//     }
//   };

//   return (
//     <>
//       <ActivityDialogs
//         activity={activity}
//         isEnrolled={isEnrolled}
//         isErrorDialogOpen={isErrorDialogOpen}
//         isEnrollModalOpen={isEnrollModalOpen}
//         isUnEnrollModalOpen={isUnEnrollModalOpen}
//         onCloseError={() => setIsErrorDialogOpen(false)}
//         onCloseEnroll={() => setIsEnrollModalOpen(false)}
//         onCloseUnenroll={() => setIsUnEnrollModalOpen(false)}
//         onConfirmEnroll={handleEnroll}
//         onConfirmUnenroll={handleUnenroll}
//       />

//       <div className="flex justify-between items-center mt-4 text-[14px]">
//         <div className="flex items-center gap-2">
//           <div className="flex items-center gap-1 font-[Sarabun] font-semibold">
//             <Clock size={25} />
//             {activity.start_activity_date
//               ? formatTime(new Date(activity.start_activity_date))
//               : "ไม่ระบุ"}{" "}
//             -{" "}
//             {activity.end_activity_date
//               ? formatTime(new Date(activity.end_activity_date))
//               : "ไม่ระบุ"}
//           </div>

//           <div className="flex items-center gap-1 ml-3 font-[Sarabun] font-semibold">
//             {getStateIcon(activity.activity_state)} {activity.activity_state}
//           </div>
//         </div>

//         <div className="flex justify-end gap-3">
//           <Button onClick={() => window.history.back()}>← กลับ</Button>

//           {activity.event_format === "Course" ? (
//             <Button 
//               onClick={() => navigate("/send-certificate-student")}
//             >
//               ยื่นเกียรติบัตร
//             </Button>
//           ) : isEnrolled ? (
//             <Button bgColor="red" onClick={() => setIsUnEnrollModalOpen(true)}>
//               ยกเลิกลงทะเบียน
//             </Button>
//           ) : CAN_ENROLL_STATES.includes(activity.activity_state) ? (
//             <Button
//               onClick={() => {
//                 // 👉 เช็กเวลาซ้อนก่อนเปิด Dialog2
//                 const hasTimeConflict = enrolledActivities.some((act) => {
//                   if (
//                     activity.event_format === "Course" ||
//                     act.event_format === "Course"
//                   )
//                     return false;
//                   const existingStart = new Date(
//                     act.start_activity_date
//                   ).getTime();
//                   const existingEnd = new Date(act.end_activity_date).getTime();
//                   const newStart = new Date(
//                     activity.start_activity_date
//                   ).getTime();
//                   const newEnd = new Date(activity.end_activity_date).getTime();
//                   return (
//                     (newStart >= existingStart && newStart < existingEnd) ||
//                     (newEnd > existingStart && newEnd <= existingEnd) ||
//                     (newStart <= existingStart && newEnd >= existingEnd)
//                   );
//                 });

//                 if (hasTimeConflict) {
//                   // แสดง Dialog1 ทันที
//                   setIsErrorDialogOpen(true);
//                   return;
//                 }

//                 // ไม่ซ้อนเวลา → เปิด Dialog2 (confirm register)
//                 setIsEnrollModalOpen(true);
//               }}
//             >
//               ลงทะเบียน
//             </Button>
//           ) : (
//             <Button bgColor="gray" className="cursor-not-allowed">
//               ยังไม่เปิดลงทะเบียน
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
import {
  Play,
  StepForward,
  CalendarHeart,
  BookCheck,
  CalendarFold,
  FileText,
  CalendarOff,
  FileCheck,
  Clock,
} from "lucide-react";
import ActivityDialogs from "./ActivityDialogs";

type Mode = "catalog" | "history";

interface Props {
  mode: Mode;
  evaluationDone: boolean;

  activity: any;
  isEnrolled: boolean;
  enrollActivity: (userId: number, activityId: number, food?: string) => Promise<void> | void;
  unenrollActivity: (userId: number, activityId: number) => Promise<void> | void;
  setIsEnrolled: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: (path: string) => void;
  enrolledActivities: Array<{
    activity_id: number;
    event_format: string;
    start_activity_date: string;
    end_activity_date: string;
  }>;
  selectedFood: string;
  userId: number | null;
}

const CAN_ENROLL_STATES = ["Open Register", "Special Open"];

export default function ActivityFooter({
  mode,
  evaluationDone,
  activity,
  isEnrolled,
  enrollActivity,
  unenrollActivity,
  setIsEnrolled,
  navigate,
  enrolledActivities,
  selectedFood,
  userId,
}: Props) {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isUnEnrollModalOpen, setIsUnEnrollModalOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const handleEnroll = async () => {
    if (!CAN_ENROLL_STATES.includes(activity.activity_state)) {
      toast.error("กิจกรรมนี้ไม่อยู่ในช่วงเปิดลงทะเบียน");
      return;
    }
    if (!userId) {
      toast.error("❌ ไม่พบข้อมูลผู้ใช้");
      return;
    }
    if (
      activity.activityFood &&
      activity.activityFood.length > 0 &&
      !selectedFood &&
      activity.event_format === "Onsite"
    ) {
      toast.error("❌ กรุณาเลือกอาหารก่อนลงทะเบียน");
      return;
    }

    // ตรวจเวลาซ้อน
    const hasTimeConflict = Array.isArray(enrolledActivities) && enrolledActivities.some((act) => {
      if (activity.event_format === "Course" || act.event_format === "Course") return false;
      const existingStart = new Date(act.start_activity_date).getTime();
      const existingEnd = new Date(act.end_activity_date).getTime();
      const newStart = new Date(activity.start_activity_date).getTime();
      const newEnd = new Date(activity.end_activity_date).getTime();
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
    if (hasTimeConflict) {
      setIsErrorDialogOpen(true);
      return;
    }

    await enrollActivity(userId, activity.activity_id, selectedFood);
    setIsEnrolled(true);
    toast.success("✅ ลงทะเบียนกิจกรรมสำเร็จ");
  };

  const handleUnenroll = async () => {
    if (!userId) {
      toast.error("❌ ไม่พบข้อมูลผู้ใช้");
      return;
    }
    try {
      await unenrollActivity(userId, activity.activity_id);
      setIsEnrolled(false);
      navigate("/main-student");
      toast.success("✅ ยกเลิกการลงทะเบียนสำเร็จ");
    } catch (error) {
      console.error("❌ ยกเลิกการลงทะเบียนไม่สำเร็จ:", error);
      toast.error("❌ เกิดข้อผิดพลาดในการยกเลิกการลงทะเบียน");
    }
  };

  const formatTime = (date: Date): string =>
    new Intl.DateTimeFormat("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);

  const getStateIcon = (state: string) => {
    switch (state) {
      case "Not Start":
        return <Play size={25} />;
      case "Start Activity":
        return <StepForward size={25} />;
      case "Special Open":
        return <CalendarHeart size={25} />;
      case "End Activity":
        return <BookCheck size={25} />;
      case "Open Register":
        return <CalendarFold size={25} />;
      case "Start Assessment":
        return <FileText size={25} />;
      case "Close Register":
        return <CalendarOff size={25} />;
      case "End Assessment":
        return <FileCheck size={25} />;
      default:
        return <Play size={25} />;
    }
  };

  return (
    <>
      <ActivityDialogs
        activity={activity}
        isEnrolled={isEnrolled}
        isErrorDialogOpen={isErrorDialogOpen}
        isEnrollModalOpen={isEnrollModalOpen}
        isUnEnrollModalOpen={isUnEnrollModalOpen}
        onCloseError={() => setIsErrorDialogOpen(false)}
        onCloseEnroll={() => setIsEnrollModalOpen(false)}
        onCloseUnenroll={() => setIsUnEnrollModalOpen(false)}
        onConfirmEnroll={handleEnroll}
        onConfirmUnenroll={handleUnenroll}
      />

      <div className="flex justify-between items-center mt-4 text-[14px]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-[Sarabun] font-semibold">
            <Clock size={25} />
            {activity.start_activity_date
              ? formatTime(new Date(activity.start_activity_date))
              : "ไม่ระบุ"}{" "}
            -{" "}
            {activity.end_activity_date
              ? formatTime(new Date(activity.end_activity_date))
              : "ไม่ระบุ"}
          </div>

          <div className="flex items-center gap-1 ml-3 font-[Sarabun] font-semibold">
            {getStateIcon(activity.activity_state)} {activity.activity_state}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={() => navigate(-1)}>← กลับ</Button>

          {mode === "history" ? (
            evaluationDone ? (
              <Button bgColor="gray" className="cursor-not-allowed" disabled>
                ทำแบบประเมินแล้ว
              </Button>
            ) : (
              <Button
                onClick={() =>
                  navigate("/assessment-student", {
                    state: { activityId: activity.activity_id },
                  })
                }
              >
                ยังไม่ทำแบบประเมิน
              </Button>
            )
          ) : (
            <>
              {activity.event_format === "Course" ? (
                <Button onClick={() => navigate("/send-certificate-student")}>
                  ยื่นเกียรติบัตร
                </Button>
              ) : isEnrolled ? (
                <Button bgColor="red" onClick={() => setIsUnEnrollModalOpen(true)}>
                  ยกเลิกลงทะเบียน
                </Button>
              ) : CAN_ENROLL_STATES.includes(activity.activity_state) ? (
                <Button onClick={() => {
                  const hasTimeConflict = Array.isArray(enrolledActivities) && enrolledActivities.some((act) => {
                    if (activity.event_format === "Course" || act.event_format === "Course") return false;
                    const existingStart = new Date(act.start_activity_date).getTime();
                    const existingEnd = new Date(act.end_activity_date).getTime();
                    const newStart = new Date(activity.start_activity_date).getTime();
                    const newEnd = new Date(activity.end_activity_date).getTime();
                    return (
                      (newStart >= existingStart && newStart < existingEnd) ||
                      (newEnd > existingStart && newEnd <= existingEnd) ||
                      (newStart <= existingStart && newEnd >= existingEnd)
                    );
                  });
                  if (hasTimeConflict) {
                    setIsErrorDialogOpen(true);
                    return;
                  }
                  setIsEnrollModalOpen(true);
                }}>
                  ลงทะเบียน
                </Button>
              ) : (
                <Button bgColor="gray" className="cursor-not-allowed" disabled>
                  ยังไม่เปิดลงทะเบียน
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
