import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "../../../../../components/ConfirmDialog";
import Button from "../../../../../components/Button";
import { Clock, Play } from "lucide-react";

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
  selectedFood,  // รับ selectedFood จาก props
}: Props) {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isUnEnrollModalOpen, setIsUnEnrollModalOpen] = useState(false);

  // ฟังก์ชันการลงทะเบียน
  const handleEnroll = async () => {
    const userId = 8; // เปลี่ยนเป็น userId จริง
    if (!userId) {
      toast.error("❌ ไม่พบข้อมูลผู้ใช้");
      return;
    }

    if (
      activity.food &&
      activity.food.length > 0 &&
      !selectedFood && // ตรวจสอบว่าเลือกอาหารหรือยัง
      activity.location_type === "Onsite"
    ) {
      toast.error("❌ กรุณาเลือกอาหารก่อนลงทะเบียน");
      return;
    }

    // ตรวจสอบเวลา
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

    await enrollActivity(userId, activity.id, selectedFood); // ส่ง selectedFood ไปด้วย
    setIsEnrolled(true);
    navigate("/list-activity-student");
  };

  // ฟังก์ชันการยกเลิกการลงทะเบียน
  const handleUnenroll = async () => {
    const userId = 8; // เปลี่ยนเป็น userId จริง
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
    hours = hours % 12 || 12; // แปลง 0 เป็น 12
    minutes = minutes.toString().padStart(2, "0"); // เติม 0 ข้างหน้า ถ้าจำนวนน้อยกว่า 10
    return `${hours}:${minutes} ${ampm}`;
  };

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
          <Button color="blue" onClick={() => window.history.back()}>
            ← กลับ
          </Button>

          {isEnrolled ? (
            <Button color="red" onClick={() => setIsUnEnrollModalOpen(true)}>
              ยกเลิกลงทะเบียน
            </Button>
          ) : (
            <Button color="blue" onClick={() => setIsEnrollModalOpen(true)}>
              ลงทะเบียน
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
