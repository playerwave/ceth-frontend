import Button from "../../../../../components/Button";
import { CalendarDays, Play } from "lucide-react";

interface Props {
  startTime?: string | Date | null;
  endTime?: string | Date | null;
  state: string;
  locationType?: string; // เพิ่มตรงนี้
  onBack: () => void;
  onEdit: () => void;
}

const formatDate = (dateInput?: string | Date | null) => {
  if (!dateInput) return "ไม่ระบุ";
  const date = new Date(dateInput);
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatTime = (dateInput?: string | Date | null) => {
  if (!dateInput) return "ไม่ระบุ";
  const date = new Date(dateInput);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedHours = hours.toString().padStart(2, "0"); // ✅ เติม 0 ถ้าหลักเดียว
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const formatDateTimeRange = (
  startTime?: string | Date | null,
  endTime?: string | Date | null
) => {
  if (!startTime && !endTime) return "ไม่ระบุ";

  const startDate = formatDate(startTime);
  const startFormattedTime = formatTime(startTime);
  const endDate = formatDate(endTime);
  const endFormattedTime = formatTime(endTime);

  return `${startDate}(${startFormattedTime}) - ${endDate}(${endFormattedTime})`;
};

export default function ActivityFooter({
  startTime,
  endTime,
  state,
  locationType,
  onBack,
  onEdit,
}: Props) {
  const isCourse = locationType === "Course";
  return (
    <div className="flex justify-between items-center mt-1 text-[14px]">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 font-[Sarabun] font-semibold">
          <CalendarDays size={25} />
          {formatDateTimeRange(startTime, endTime)}
        </div>

        <div className="flex items-center gap-1 ml-3 font-[Sarabun] font-semibold">
          <Play size={25} /> {state}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button width="120px" onClick={onBack}>
          ← กลับ
        </Button>

        <div className={isCourse ? "opacity-50 pointer-events-none" : ""}>
          <Button
            width="120px"
            onClick={() => {
              if (!isCourse) {
                // logic scan
              }
            }}
          >
            Scan
          </Button>
        </div>
        
        <Button width="120px" onClick={onEdit}>
          แก้ไข
        </Button>
      </div>
    </div>
  );
}
