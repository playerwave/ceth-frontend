import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button as MuiButton,
} from "@mui/material";
import { Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<Props> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 400,
          maxWidth: "90%",
          borderRadius: 2,
          p: 2,
        },
      }}
    >
      <DialogTitle>
        <div className="flex items-center gap-2 font-bold text-black">
          <Trash2 className="text-red-600" />
          ลบเมนูอาหาร
        </div>
      </DialogTitle>

      <DialogContent>
        <DialogContentText className="text-gray-700 mb-2">
          คุณแน่ใจหรือไม่ที่ต้องการลบเมนูอาหารนี้
        </DialogContentText>
        <DialogContentText style={{ color: "#dc2626" }}>
          ลบแล้วไม่สามารถกู้คืนเมนูอาหารได้ *
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <MuiButton onClick={onClose} sx={{ color: "#1976d2" }}>
          Cancel
        </MuiButton>
        <MuiButton
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{ px: 3 }}
        >
          DELETE
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
