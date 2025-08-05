import ConfirmDialog from "../../../../../components/ConfirmDialog";
import { useActivityStore } from "../../../../../stores/Student/activity.store.student";

interface ConfirmModalProps {
  isEnrolled: boolean;
  isEnrollModalOpen: boolean;
  setIsEnrollModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUnEnrollModalOpen: boolean;
  setIsUnEnrollModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activityEndRegister: Date | string;
  userId: number;
  activityId: number;
  selectedFoods?: string[];
  onConfirmEnroll?: () => Promise<void>;
  onConfirmUnenroll?: () => Promise<void>;
}

export default function ConfirmModal({
  isEnrolled,
  isEnrollModalOpen,
  setIsEnrollModalOpen,
  isUnEnrollModalOpen,
  setIsUnEnrollModalOpen,
  activityEndRegister,
  userId,
  activityId,
  selectedFoods,
  onConfirmEnroll,
  onConfirmUnenroll,
}: ConfirmModalProps) {
  const { enrollActivity, unenrollActivity } = useActivityStore();

  const handleEnroll = async () => {
    try {
      await enrollActivity(userId, activityId, selectedFoods);
      console.log("✅ ลงทะเบียนกิจกรรมสำเร็จ!");
      setIsEnrollModalOpen(false);
      // เรียก callback ถ้ามี
      if (onConfirmEnroll) {
        await onConfirmEnroll();
      }
    } catch (error) {
      console.error("❌ Error enrolling activity:", error);
      console.error("❌ ลงทะเบียนกิจกรรมไม่สำเร็จ!");
    }
  };

  const handleUnenroll = async () => {
    try {
      await unenrollActivity(userId, activityId);
      console.log("✅ ยกเลิกการลงทะเบียนสำเร็จ!");
      setIsUnEnrollModalOpen(false);
      // เรียก callback ถ้ามี
      if (onConfirmUnenroll) {
        await onConfirmUnenroll();
      }
    } catch (error) {
      console.error("❌ Error unenrolling activity:", error);
      console.error("❌ ยกเลิกการลงทะเบียนไม่สำเร็จ!");
    }
  };

  return (
    <>
      {isEnrolled ? (
        <ConfirmDialog
          isOpen={isUnEnrollModalOpen}
          title="ยกเลิกการลงทะเบียนกิจกรรม"
          message={`คุณแน่ใจว่าจะยกเลิกการลงทะเบียนกิจกรรมนี้
          (ลงทะเบียนกิจกรรมได้ถึง ${new Intl.DateTimeFormat("th-TH", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date(activityEndRegister))})`}
          onCancel={() => setIsUnEnrollModalOpen(false)}
          onConfirm={handleUnenroll}
        />
      ) : (
        <ConfirmDialog
          isOpen={isEnrollModalOpen}
          title="ยืนยันการลงทะเบียน"
          message={`คุณแน่ใจว่าจะลงทะเบียนกิจกรรมนี้
          (ยกเลิกลงทะเบียนได้ถึง ${new Intl.DateTimeFormat("th-TH", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date(activityEndRegister))})`}
          onCancel={() => setIsEnrollModalOpen(false)}
          onConfirm={handleEnroll}
        />
      )}
    </>
  );
}
