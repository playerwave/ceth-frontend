import Button from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void; // ✅ รับ callback function สำหรับการยืนยัน
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-gray-600 mt-2 whitespace-pre-line">{message}</p>

        <div className="flex justify-center gap-4 mt-6">
          <Button onClick={onCancel} type="button" color="red">
            ยกเลิก
          </Button>
          <Button
            onClick={() => {
              onConfirm(); // ✅ เรียกใช้ callback function ที่กำหนด
            }}
            type="button"
            color="blue"
          >
            ยืนยัน
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
