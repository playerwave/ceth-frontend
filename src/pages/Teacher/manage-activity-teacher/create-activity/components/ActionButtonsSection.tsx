// components/AdminActivityForm/ActionButtonsSection.tsx
import Button from "../../../../../components/Button";
import ConfirmDialog from "../../../../../components/ConfirmDialog";
import { useNavigate } from "react-router-dom";

interface Props {
  formStatus: string;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  isEditMode?: boolean;
  originalStatus?: string;
  onSubmit?: () => void; // ✅ เพิ่ม onSubmit prop
}

const ActionButtonsSection: React.FC<Props> = ({
  formStatus,
  isModalOpen,
  setIsModalOpen,
  isEditMode = false,
  originalStatus = "Private",
  onSubmit,
}) => {
  const navigate = useNavigate();

  // ตรวจสอบว่าเป็นการเปลี่ยนจาก Private เป็น Public หรือไม่
  const isStatusChangedToPublic = isEditMode && originalStatus === "Private" && formStatus === "Public";

  // กำหนดข้อความและ title ของ dialog
  const getButtonText = () => {
    if (isEditMode) {
      if (isStatusChangedToPublic) {
        return "สร้าง";
      } else {
        return "แก้ไข";
      }
    } else {
      return formStatus === "Public" ? "สร้าง" : "ร่าง";
    }
  };

  const getDialogTitle = () => {
    if (isEditMode) {
      if (isStatusChangedToPublic) {
        return "เปลี่ยนสถานะเป็น Public";
      } else {
        return "แก้ไขกิจกรรม";
      }
    } else {
      if (formStatus === "Public") {
        return "สร้างกิจกรรม Public";
      } else {
        return "สร้างกิจกรรม Private";
      }
    }
  };

  const getDialogMessage = () => {
    if (isEditMode) {
      if (isStatusChangedToPublic) {
        return "คุณแน่ใจว่าจะเปลี่ยนสถานะกิจกรรมเป็น Public\n(นิสิตทุกคนในระบบจะเห็นกิจกรรมนี้)";
      } else {
        return "คุณแน่ใจว่าจะแก้ไขกิจกรรมนี้";
      }
    } else {
      if (formStatus === "Public") {
        return "คุณแน่ใจว่าจะสร้างกิจกรรมที่เป็น Public\n(นิสิตทุกคนในระบบจะเห็นกิจกรรมนี้)";
      } else {
        return "คุณแน่ใจว่าจะสร้างกิจกรรมที่เป็น Private\n(เฉพาะนิสิตที่ได้รับเชิญเท่านั้นที่เห็นกิจกรรมนี้)";
      }
    }
  };

  return (
    <>
      <ConfirmDialog
        isOpen={isModalOpen}
        title={getDialogTitle()}
        message={getDialogMessage()}
        onCancel={() => setIsModalOpen(false)}
        type="submit"
        onConfirm={() => {
          setIsModalOpen(false);
          onSubmit?.(); // ✅ เรียก onSubmit function
        }}
      />

      <div className="mt-auto flex justify-end items-center space-x-4 px-6">
        {/* ปุ่มยกเลิก */}
        <Button
          type="button"
          bgColor="red"
          onClick={() => navigate("/list-activity-admin")}
        >
          ยกเลิก
        </Button>

        {/* ปุ่มสร้าง / แก้ไข / ร่าง */}
        <Button
          onClick={() => {
            setIsModalOpen(true);
            console.log("clicked");
          }}
          bgColor="blue"
        >
          {getButtonText()}
        </Button>
      </div>
    </>
  );
};

export default ActionButtonsSection;
