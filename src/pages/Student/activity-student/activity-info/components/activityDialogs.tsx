import Dialog1 from "@/components/Dialog/Dialog1";
import Dialog2 from "@/components/Dialog/Dialog2";
import { Activity } from "@/types/activity.types";

interface ActivityDialogsProps {
  activity: Partial<Activity>
  isEnrolled: boolean;
  isErrorDialogOpen: boolean;
  isEnrollModalOpen: boolean;
  isUnEnrollModalOpen: boolean;
  onCloseError: () => void;
  onCloseEnroll: () => void;
  onCloseUnenroll: () => void;
  onConfirmEnroll: () => void;
  onConfirmUnenroll: () => void;
}

export default function ActivityDialogs({
  activity,
  isEnrolled,
  isErrorDialogOpen,
  isEnrollModalOpen,
  isUnEnrollModalOpen,
  onCloseError,
  onCloseEnroll,
  onCloseUnenroll,
  onConfirmEnroll,
  onConfirmUnenroll,
}: ActivityDialogsProps) {
  // ✅ ฟังก์ชันสำหรับจัดการวันที่ที่ปลอดภัย
  const formatDateSafely = (dateValue: string | Date | null | undefined): string => {
    if (!dateValue) return "ไม่ระบุ";
    
    // ✅ แปลงเป็น string ก่อนถ้าเป็น Date object
    const dateString = typeof dateValue === 'string' ? dateValue : dateValue.toISOString();
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "ไม่ระบุ";
    
    return new Intl.DateTimeFormat("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // ✅ ตรวจสอบว่าเป็น Course activity หรือไม่
  const isCourseActivity = activity.event_format === "Course";
  return (
    <>
      {/* dialog เวลา conflict */}
      <Dialog1
        open={isErrorDialogOpen}
        onClose={onCloseError}
        title="ไม่สามารถลงทะเบียนกิจกรรมได้"
        message="เนื่องจากกิจกรรมนี้มีเวลาตรงกับกิจกรรมอื่นที่ท่านเคยลงทะเบียนเอาไว้แล้ว"
      />

      {/* dialog confirm */}
      {isEnrolled ? (
        <Dialog2
          open={isUnEnrollModalOpen}
          title="ยกเลิกการลงทะเบียนกิจกรรม"
          message={
            <p className="text-gray-600">
              คุณแน่ใจหรือไม่ว่าต้องการยกเลิกกิจกรรม{" "}
              <span className="font-medium">
                "{activity.presenter_company_name}"
              </span>{" "}
              ที่ลงทะเบียนไว้
              {!isCourseActivity && (
                <span className="text-red-500">
                  {" "}กรุณายกเลิกลงทะเบียนก่อน{" "}
                  {formatDateSafely(activity.end_register_date)}
                </span>
              )}
            </p>
          }
          onClose={onCloseUnenroll}
          onConfirm={onConfirmUnenroll}
        />
      ) : (
        <Dialog2
          open={isEnrollModalOpen}
          title="ลงทะเบียนกิจกรรม"
          message={
            <p className="text-gray-600">
              คุณแน่ใจหรือไม่ว่าต้องการลงทะเบียนกิจกรรม{" "}
              <span className="font-medium">
                "{activity.presenter_company_name}"
              </span>
              {!isCourseActivity && (
                <span className="text-red-500">
                  {" "}คุณสามารถยกเลิกได้ถึงวันที่{" "}
                  {formatDateSafely(activity.end_register_date)}
                </span>
              )}
            </p>
          }
          onClose={onCloseEnroll}
          onConfirm={onConfirmEnroll}
        />
      )}
    </>
  );
}
