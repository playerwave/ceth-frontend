import Dialog1 from "../../../../../components/Dialog/Dialog1";
import Dialog2 from "../../../../../components/Dialog/Dialog2";

interface ActivityDialogsProps {
  activity: {
    presenter_company_name: string;
    end_register_date: string;
  };
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
                “{activity.presenter_company_name}”
              </span>{" "}
              ที่ลงทะเบียนไว้{" "}
              <span className="text-red-500">
                กรุณายกเลิกลงทะเบียนก่อน{" "}
                {new Intl.DateTimeFormat("th-TH", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(activity.end_register_date))}
              </span>
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
                “{activity.presenter_company_name}”
              </span>{" "}
              <span className="text-red-500">
                คุณสามารถยกเลิกได้ถึงวันที่{" "}
                {new Intl.DateTimeFormat("th-TH", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(activity.end_register_date))}
              </span>
            </p>
          }
          onClose={onCloseEnroll}
          onConfirm={onConfirmEnroll}
        />
      )}
    </>
  );
}
