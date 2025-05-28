import Dialog2 from "../../../../../components/Dialog2";

interface ConfirmModalProps {
  activity: any; // ✅ เพิ่มตรงนี้
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
  activity, // ✅ ใส่ตรงนี้ด้วย
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
        <Dialog2
          open={isUnEnrollModalOpen}
          title="ยกเลิกการลงทะเบียนกิจกรรม"
          message={
            <p className="text-gray-600">
              คุณแน่ใจหรือไม่ว่าต้องการยกเลิกกิจกรรม{" "}
              <span className="font-medium">“{activity.company_lecturer}”</span>{" "}
              ที่ลงทะเบียนไว้{" "}
              <span className="text-red-500">
                กรุณายกเลิกลงทะเบียนก่อน{" "}
                {new Intl.DateTimeFormat("th-TH", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(activityEndRegister))}
              </span>
            </p>
          }
          onClose={() => setIsUnEnrollModalOpen(false)}
          onConfirm={onConfirmUnenroll}
        />
      ) : (
        <Dialog2
          open={isEnrollModalOpen}
          title="ลงทะเบียนกิจกรรม"
          message={
            <p className="text-gray-600">
              คุณแน่ใจหรือไม่ว่าต้องการลงทะเบียนกิจกรรม{" "}
              <span className="font-medium">“{activity.company_lecturer}”</span>{" "}
              <p className="text-red-500">
                คุณสามารถยกเลิกได้ถึงวันที่{" "}
                {new Intl.DateTimeFormat("th-TH", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(activityEndRegister))}
              </p>
            </p>
          }
          onClose={() => setIsEnrollModalOpen(false)}
          onConfirm={onConfirmEnroll}
        />
      )}
    </>
  );
}
