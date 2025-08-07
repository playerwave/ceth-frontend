import { center } from "@cloudinary/url-gen/qualifiers/textAlignment";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useEffect } from "react";

console.log("📦 ConfirmDialog loaded");

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDialog = ({
  open,
  message,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => {
  useEffect(() => {
    if (open) {
      console.log("📦 ConfirmDialog OPENED");
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          border: "2px solid #1E3A8A",
          borderRadius: "12px",
          boxShadow: 6,
          maxWidth: 500,
          width: "100%",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", px: 5 }}>
        เปลี่ยนสถานะของกิจกรรม
      </DialogTitle>

      <DialogContent>
        <Typography
          color="text.secondary"
          sx={{
            px: 5,
            textAlign: center,
            wordBreak: "break-word",
            whiteSpace: "pre-line",
            fontFamily: "inherit",
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)", px: 3, py: 2 }}
      >
        <Button onClick={onClose} color="error">
          ยกเลิก
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: "#1E3A8A",
            color: "#fff",
            "&:hover": { backgroundColor: "#173f7f" },
          }}
        >
          ยืนยัน
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
