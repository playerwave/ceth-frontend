import { FormControlLabel, Checkbox } from "@mui/material";
import { User } from "lucide-react";

interface Props {
  selectedDepartments: string[];
  setSelectedDepartments: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStatus: string[];
  setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>;
  activity: any; // รับข้อมูลกิจกรรมจาก props
}

export default function EnrolledListFilter({
  selectedDepartments,
  setSelectedDepartments,
  selectedStatus,
  setSelectedStatus,
  activity,
}: Props) {
  return (
    <div className="flex justify-between items-center p-4">

      {/* ข้อมูลจำนวนผู้ลงทะเบียน */}
      <div className="flex items-center gap-2 text-lg font-semibold">
        {activity
          ? `${activity.registered_count || 0}/${activity.seat || 0}`
          : "กำลังโหลด..."}{" "}
        <User size={24} />
      </div>

      <div className="flex gap-4">
        {/* ฟิลเตอร์สาขา */}
        <div className="flex items-center gap-2">
          <button className="bg-blue-900 text-white px-4 py-1 rounded">สาขา</button>
          {["SE", "AI", "CS", "IT"].map((dept) => (
            <FormControlLabel
              key={dept}
              control={
                <Checkbox
                  checked={selectedDepartments.includes(dept)}
                  onChange={() =>
                    setSelectedDepartments((prev) =>
                      prev.includes(dept)
                        ? prev.filter((d) => d !== dept)
                        : [...prev, dept]
                    )
                  }
                  sx={{
                    color: "#757575",
                    "&.Mui-checked": { color: "#2196F3" },
                  }}
                />
              }
              label={dept}
            />
          ))}
        </div>

        {/* ฟิลเตอร์สถานะ */}
        <div className="flex items-center gap-2">
          <button className="bg-blue-900 text-white px-4 py-1 rounded">สถานะ</button>
          {["normal", "risk"].map((status) => (
            <FormControlLabel
              key={status}
              control={
                <Checkbox
                  checked={selectedStatus.includes(status)}
                  onChange={() =>
                    setSelectedStatus((prev) =>
                      prev.includes(status)
                        ? prev.filter((s) => s !== status)
                        : [...prev, status]
                    )
                  }
                  sx={{
                    color: "#757575",
                    "&.Mui-checked": { color: "#2196F3" },
                  }}
                />
              }
              label={status === "normal" ? "ปกติ" : "เสี่ยง"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
