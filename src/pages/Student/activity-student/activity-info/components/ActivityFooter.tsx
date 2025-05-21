import { useState } from "react";
import { toast } from "sonner";
import Button from "../../../../../components/Button";
import { Clock, Play } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

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
      toast.error(
        "ไม่สามารถลงทะเบียนได้: เวลากิจกรรมนี้ทับซ้อนกับกิจกรรมอื่นที่คุณลงทะเบียนเอาไว้แล้ว"
      );
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
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    minutes = minutes.toString().padStart(2, "0");
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <>
      <ConfirmModal
        isEnrolled={isEnrolled}
        isEnrollModalOpen={isEnrollModalOpen}
        setIsEnrollModalOpen={setIsEnrollModalOpen}
        isUnEnrollModalOpen={isUnEnrollModalOpen}
        setIsUnEnrollModalOpen={setIsUnEnrollModalOpen}
        activityEndRegister={activity.end_register}
        onConfirmEnroll={handleEnroll}
        onConfirmUnenroll={handleUnenroll}
      />

      <div className="flex justify-between items-center mt-4 text-[14px]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-[Sarabun] font-semibold">
            <Clock size={25} />
            {activity.start_time
              ? formatTime(new Date(activity.start_time))
              : "ไม่ระบุ"}{" "}
            -{" "}
            {activity.end_time
              ? formatTime(new Date(activity.end_time))
              : "ไม่ระบุ"}
          </div>

          <div className="flex items-center gap-1 ml-3 font-[Sarabun] font-semibold">
            <Play size={25} /> {activity.state}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={() => window.history.back()}>← กลับ</Button>

          {isEnrolled ? (
            <Button bgColor="red" onClick={() => setIsUnEnrollModalOpen(true)}>
              ยกเลิกลงทะเบียน
            </Button>
          ) : (
            <Button onClick={() => setIsEnrollModalOpen(true)}>ลงทะเบียน</Button>
          )}
        </div>
      </div>
    </>
  );
}
