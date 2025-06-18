// components/AdminActivityForm/ActionButtonsSection.tsx
import Button from "../../../../../components/Button";
import ConfirmDialog from "../../../../../components/ConfirmDialog";
import { useNavigate } from "react-router-dom";

interface Props {
  formStatus: string;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const ActionButtonsSection: React.FC<Props> = ({ formStatus, isModalOpen, setIsModalOpen }) => {
  const navigate = useNavigate();

  return (
    <>
      <ConfirmDialog
        isOpen={isModalOpen}
        title="สร้างกิจกรรม"
        message="คุณแน่ใจว่าจะสร้างกิจกรรมที่เป็น Public\n(นิสิตทุกคนในระบบจะเห็นกิจกรรมนี้)"
        onCancel={() => setIsModalOpen(false)}
        type="submit"
        onConfirm={() => {}}
      />

      <div className="mt-auto flex justify-end items-center space-x-4 px-6">
        {/* ปุ่มยกเลิก */}
        <Button type="button" color="red" onClick={() => navigate("/list-activity-admin")}>ยกเลิก</Button>

        {/* ปุ่มสร้าง / ร่าง */}
        {formStatus === "Public" ? (
          <Button
            onClick={() => {
              setIsModalOpen(true);
              console.log("clicked");
            }}
            color="blue"
          >
            สร้าง
          </Button>
        ) : (
          <Button
            onClick={() => {
              console.log("clicked");
            }}
            color="blue"
            type="submit"
          >
            ร่าง
          </Button>
        )}
      </div>
    </>
  );
};

export default ActionButtonsSection;
