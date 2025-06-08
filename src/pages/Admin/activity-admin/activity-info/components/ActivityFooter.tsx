import Button from "../../../../../components/Button";
import { Clock, Play } from "lucide-react";

interface Props {
  startTime?: string | Date | null;
  endTime?: string | Date | null;
  state: string;
  onBack: () => void;
  onEdit: () => void;
}

const formatTime = (dateInput?: string | Date | null) => {
  if (!dateInput) return "ไม่ระบุ";
  const date = new Date(dateInput);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  minutes = minutes.toString().padStart(2, "0");
  return `${hours}:${minutes} ${ampm}`;
};

export default function ActivityFooter({
  startTime,
  endTime,
  state,
  onBack,
  onEdit,
}: Props) {
  return (
    <div className="flex justify-between items-center mt-4 text-[14px]">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 font-[Sarabun] font-semibold">
          <Clock size={25} />
          {formatTime(startTime)} - {formatTime(endTime)}
        </div>

        <div className="flex items-center gap-1 ml-3 font-[Sarabun] font-semibold">
          <Play size={25} /> {state}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button color="blue" onClick={onBack}>
          ← กลับ
        </Button>
        <Button color="blue">QR Code</Button>
        <Button color="blue" onClick={onEdit}>
          แก้ไข
        </Button>
      </div>
    </div>
  );
}
