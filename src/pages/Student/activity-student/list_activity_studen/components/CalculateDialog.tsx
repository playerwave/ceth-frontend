import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Button,
} from "@mui/material";

interface Activity {
  id: number;
  name: string;
  hours: number;
  type: "Hard Skill" | "Soft Skill";
}

interface Props {
  open: boolean;
  onClose: () => void;
  currentSkillHours: {
    hard: number;
    soft: number;
  };
  selectedActivities: Activity[];
}

export default function CalculateDialog({
  open,
  onClose,
  currentSkillHours,
  selectedActivities,
}: Props) {
  const totalHard = selectedActivities
    .filter((a) => a.type === "Hard Skill")
    .reduce((sum, a) => sum + a.hours, 0);

  const totalSoft = selectedActivities
    .filter((a) => a.type === "Soft Skill")
    .reduce((sum, a) => sum + a.hours, 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          border: "2px solid #000000",
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 20,
          pb: 0,
        }}
      >
        คำนวณชั่วโมงที่แนะนำกิจกรรม
      </DialogTitle>

      <DialogContent sx={{ paddingBottom: 0 }}>
        {/* ปัจจุบัน */}
        <Box display="flex" justifyContent="center" gap={4} mt={2}>
          <Box
            sx={{
              backgroundColor: "#FEF3C7",
              borderRadius: 2,
              width: 120,
              textAlign: "center",
              py: 1,
            }}
          >
            <Typography fontWeight="bold">Hard Skill ปัจจุบัน</Typography>
            <Typography fontSize={28} fontWeight="bold" color="#f59e0b">
              {currentSkillHours.hard}
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: "#E0E7FF",
              borderRadius: 2,
              width: 120,
              textAlign: "center",
              py: 1,
            }}
          >
            <Typography fontWeight="bold">Soft Skill ปัจจุบัน</Typography>
            <Typography fontSize={28} fontWeight="bold" color="#0900FF">
              {currentSkillHours.soft}
            </Typography>
          </Box>
        </Box>

        {/* รายการกิจกรรม */}
        <Box mt={4}>
          <Typography fontWeight="bold" mb={1}>
            กิจกรรมที่เลือก
          </Typography>

          {selectedActivities.map((a, i) => (
            <Box
              key={i}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              border="1px solid #E5E7EB"
              borderRadius={1}
              px={2}
              py={1}
              mb={1}
            >
              <Typography
                fontSize={14}
                sx={{
                  maxWidth: "65%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {a.name}
              </Typography>

              <Typography
                fontSize={14}
                fontWeight="bold"
                color={a.type === "Hard Skill" ? "#f59e0b" : "#3b82f6"}
              >
                + {a.hours} ชั่วโมง ({a.type})
              </Typography>
            </Box>
          ))}
        </Box>

        {/* สรุปรวม */}
        <Box display="flex" justifyContent="center" gap={4} mt={4} mb={4}>
          <Box
            sx={{
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              borderRadius: 2,
              width: 120,
              textAlign: "center",
              py: 1,
            }}
          >
            <Typography fontWeight="bold" color="#00FF00">
              รวม Hard Skill
            </Typography>
            <Typography fontSize={28} fontWeight="bold" color="#00FF00">
              {currentSkillHours.hard + totalHard}
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              borderRadius: 2,
              width: 120,
              textAlign: "center",
              py: 1,
            }}
          >
            <Typography fontWeight="bold" color="#00FF00">
              รวม Soft Skill
            </Typography>
            <Typography fontSize={28} fontWeight="bold" color="#00FF00">
              {currentSkillHours.soft + totalSoft}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      {/* พื้นที่ล่างเทา + ปุ่ม CONFIRM */}
      <Box
        sx={{
          backgroundColor: "#F3F4F6",
          py: 2,
          px: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#1E3A8A",
            color: "white",
            fontWeight: "bold",
            px: 6,
            py: 1.5,
            borderRadius: "8px",
          }}
        >
          CONFIRM
        </Button>
      </Box>
    </Dialog>
  );
}
