import { useState, useMemo, useCallback } from "react";
import TableRedesign from "../../../../components/Table_re";
import CustomCard from "../../../../components/Card";
import { getActivityColumns } from "../../../../components/activity_column";
import { Activity } from "../../../../types/Admin/activity_list_type";

// ✅ เพิ่ม MUI Dialog
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type Props = {
  rows1: Activity[];
  rows2: Activity[];
  rows3: Activity[];
  handleStatusToggle: (row: Activity) => void;
  setDialog: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      message: string;
      onConfirm: () => void;
    } | null>
  >;
};

const ActivityTablePage = ({
  rows1,
  rows2,
  rows3,
  handleStatusToggle,
}: Props) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Activity | null>(null);
  const [, setPreviewChecked] = useState<boolean | null>(null); // เพิ่ม preview

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filterByType = (rows: Activity[]) => {
    if (selectedTypes.length === 0) return rows;
    return rows.filter((row) => selectedTypes.includes(row.type));
  };

  const handleConfirmStatusChange = useCallback((row: Activity) => {
    setSelectedRow(row);
    setPreviewChecked(row.status === "Public");
    setOpenDialog(true);
  }, []);

  const confirmToggle = () => {
    if (selectedRow) {
      handleStatusToggle(selectedRow);
    }
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const activityColumns = useMemo(
    () =>
      getActivityColumns({
        includeStatus: true,
        enableTypeFilter: true,
        handleTypeChange,
        selectedTypes,
        handleStatusToggle: handleConfirmStatusChange,
      }),
    [selectedTypes, handleConfirmStatusChange]
  );

  const activityColumnsWithoutStatus = useMemo(
    () =>
      getActivityColumns({
        includeStatus: false,
        enableTypeFilter: true,
        handleTypeChange,
        selectedTypes,
      }),
    [selectedTypes]
  );

  return (
    <div style={{ padding: 24 }}>
      <CustomCard height={500} width="100%" className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">กิจกรรมสหกิจ</h2>
        <TableRedesign
          columns={activityColumns}
          rows={filterByType(rows1) ?? []}
          height={420}
          width="100%"
          borderRadius={14}
          handleStatusToggle={handleConfirmStatusChange}
        />
      </CustomCard>

      <CustomCard height={500} width="100%" className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">กิจกรรมสหกิจที่ร่าง</h2>
        <TableRedesign
          columns={activityColumns}
          rows={filterByType(rows2) ?? []}
          height={420}
          width="100%"
          borderRadius={14}
          handleStatusToggle={handleConfirmStatusChange}
        />
      </CustomCard>

      <CustomCard height={500} width="100%">
        <h2 className="text-2xl font-semibold mb-4">
          กิจกรรมสหกิจที่ให้นิสิตทำแบบประเมิน
        </h2>
        <TableRedesign
          columns={activityColumnsWithoutStatus}
          rows={filterByType(rows3) ?? []}
          height={420}
          width="100%"
          borderRadius={14}
        />
      </CustomCard>

      {/* ✅ Dialog ยืนยัน */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            border: "2px solid #1E3A8A",
            borderRadius: "12px",
            boxShadow: 6,
            maxWidth: 500, // ✅ จำกัดความกว้าง
            width: "100%", // ✅ เต็มความกว้างที่จำกัด
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
              wordBreak: "break-word", // ✅ ตัดคำให้อัตโนมัติ
              whiteSpace: "normal", // ✅ ให้ขึ้นบรรทัดใหม่ได้
            }}
          >
            คุณแน่ใจหรือไม่ที่ต้องการเปลี่ยนสถานะของกิจกรรม{" "}
            <Typography component="span">“{selectedRow?.name}”</Typography> จาก{" "}
            <Typography component="span" color="text.secondary">
              {selectedRow?.status}
            </Typography>{" "}
            เป็น{" "}
            <Typography component="span" color="text.secondary">
              {selectedRow?.status === "Public" ? "Private" : "Public"}
            </Typography>
          </Typography>
        </DialogContent>

        <DialogActions sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}>
          <Button onClick={() => setOpenDialog(false)} color="error">
            Cancel
          </Button>
          <Button
            onClick={confirmToggle}
            variant="contained"
            sx={{
              backgroundColor: "#1E3A8A",
              color: "#fff",
              "&:hover": { backgroundColor: "#173f7f" },
            }}
          >
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ActivityTablePage;
