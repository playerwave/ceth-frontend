import React from "react";
import { AlertCircle } from "lucide-react";
import Button from "../../../../../components/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 pb-4">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-black">{title}</h2>
        </div>

        {/* Message */}
        <div className="px-6 pb-6">
          <p className="text-gray-600 whitespace-pre-line">{message}</p>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 rounded-b-lg flex justify-end gap-3">
          <Button
            onClick={onCancel}
            bgColor="transparent"
            textColor="#dc2626"
            className="!shadow-none hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            bgColor="#1E3A8A"
            textColor="#ffffff"
          >
            CONFIRM
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
