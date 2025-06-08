import ConfirmDialog from "../../../../../components/ConfirmDialog";

interface ConfirmModalProps {
  isEnrolled: boolean;
  isEnrollModalOpen: boolean;
  setIsEnrollModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUnEnrollModalOpen: boolean;
  setIsUnEnrollModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activityEndRegister: Date | string;
  onConfirmEnroll: () => Promise<void>;
  onConfirmUnenroll: () => Promise<void>;
}

export default function ConfirmModal({
  isEnrolled,
  isEnrollModalOpen,
  setIsEnrollModalOpen,
  isUnEnrollModalOpen,
  setIsUnEnrollModalOpen,
  activityEndRegister,
  onConfirmEnroll,
  onConfirmUnenroll,
}: ConfirmModalProps) {
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
          onConfirm={onConfirmUnenroll}
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
          onConfirm={onConfirmEnroll}
        />
      )}
    </>
  );
}
