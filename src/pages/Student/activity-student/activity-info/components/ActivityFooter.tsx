import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "../../../../../components/ConfirmDialog";
import Button from "../../../../../components/Button";
import { Clock, Play } from "lucide-react";
import { useAuthStore } from "../../../../../stores/Visitor/auth.store";

interface Props {
  activity: any;
  isEnrolled: boolean;
  enrollActivity: any;
  unenrollActivity: any;
  setIsEnrolled: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: any;
  enrolledActivities: any[]; // เพิ่ม enrolledActivities
  selectedFood: string; // ใช้ selectedFood จาก props
}

export default function ActivityFooter({
  activity,
  isEnrolled,
  enrollActivity,
  unenrollActivity,
  setIsEnrolled,
  navigate,
  enrolledActivities,
  selectedFood, // รับ selectedFood จาก props
}: Props) {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isUnEnrollModalOpen, setIsUnEnrollModalOpen] = useState(false);

  // ฟังก์ชันการลงทะเบียน
  // const handleEnroll = async () => {
  //   const userId = 8; // เปลี่ยนเป็น userId จริง
  //   if (!userId) {
  //     toast.error("❌ ไม่พบข้อมูลผู้ใช้");
  //     return;
  //   }

  //   if (
  //     activity.activityFood &&
  //     activity.activityFood.length > 0 &&
  //     !selectedFood && // ตรวจสอบว่าเลือกอาหารหรือยัง
  //     activity.event_format === "Onsite"
  //   ) {
  //     toast.error("❌ กรุณาเลือกอาหารก่อนลงทะเบียน");
  //     return;
  //   }

  //   // ตรวจสอบเวลา
  //   const hasTimeConflict = enrolledActivities.some((act) => {
  //     if (
  //       activity.event_format === "Course" ||
  //       act.event_format === "Course"
  //     ) {
  //       return false;
  //     }

  //     const existingStart = new Date(act.start_activity_date).getTime();
  //     const existingEnd = new Date(act.end_activity_date).getTime();
  //     const newStart = new Date(activity.start_activity_date).getTime();
  //     const newEnd = new Date(activity.end_activity_date).getTime();

  //     return (
  //       (newStart >= existingStart && newStart < existingEnd) ||
  //       (newEnd > existingStart && newEnd <= existingEnd) ||
  //       (newStart <= existingStart && newEnd >= existingEnd)
  //     );
  //   });

  //   if (hasTimeConflict) {
  //     toast.error(
  //       "ไม่สามารถลงทะเบียนได้: เวลากิจกรรมนี้ทับซ้อนกับกิจกรรมอื่นที่คุณลงทะเบียนเอาไว้แล้ว",
  //     );
  //     return;
  //   }

  //   await enrollActivity(userId, activity.id, selectedFood); // ส่ง selectedFood ไปด้วย
  //   setIsEnrolled(true);
  //   navigate("/list-activity-student");
  // };

  // ✅ ดึง useAuthStore ที่ด้านบนของ Component
  const { user } = useAuthStore();
  const userId = user?.userId;

  const handleEnroll = async () => {
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

    const hasTimeConflict = enrolledActivities.some((act) => {
      if (activity.event_format === "Course" || act.event_format === "Course") {
        return false;
      }

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
      toast.error(
        "ไม่สามารถลงทะเบียนได้: เวลากิจกรรมนี้ทับซ้อนกับกิจกรรมอื่นที่คุณลงทะเบียนเอาไว้แล้ว"
      );
      return;
    }

    await enrollActivity(userId, activity.activity_id, selectedFood);
    setIsEnrolled(true);
    // navigate("/list-activity-student");
  };

  // ฟังก์ชันการยกเลิกการลงทะเบียน
  // const handleUnenroll = async () => {
  //   const userId = 8; // เปลี่ยนเป็น userId จริง
  //   if (!userId) {
  //     toast.error("❌ ไม่พบข้อมูลผู้ใช้");
  //     return;
  //   }

  //   await unenrollActivity(userId, activity.id);
  //   setIsEnrolled(false);
  //   navigate("/main-student");
  // };

  const handleUnenroll = async () => {
    if (!userId) {
      toast.error("❌ ไม่พบข้อมูลผู้ใช้");
      return;
    }

    try {
      await unenrollActivity(userId, activity.id);
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

  return (
    <>
      {/* Modal สำหรับยืนยันการลงทะเบียน */}
      {isEnrolled ? (
        <ConfirmDialog
          isOpen={isUnEnrollModalOpen}
          title="ยกเลิกการลงทะเบียนกิจกรรม"
          message={`คุณแน่ใจว่าจะยกเลิกการลงทะเบียนกิจกรรมนี้
                      (ลงทะเบียนกิจกรรมได้ถึง ${new Intl.DateTimeFormat(
                        "th-TH",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      ).format(activity.end_register)})`}
          onCancel={() => setIsUnEnrollModalOpen(false)}
          onConfirm={handleUnenroll}
        />
      ) : (
        <ConfirmDialog
          isOpen={isEnrollModalOpen}
          title="ยืนยันการลงทะเบียน"
          message={`คุณแน่ใจว่าจะลงทะเบียนกิจกรรมนี้
                      (ยกเลิกลงทะเบียนได้ถึง ${new Intl.DateTimeFormat(
                        "th-TH",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      ).format(activity.end_register)})`}
          onCancel={() => setIsEnrollModalOpen(false)}
          onConfirm={handleEnroll}
        />
      )}

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
            <Play size={25} /> {activity.activity_state}
          </div>
        </div>

        <div className="flex justify-end gap-3">
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
