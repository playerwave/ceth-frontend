import { User } from "lucide-react";

interface Props {
  activity: any;
}

export default function ActivityHeader({ activity }: Props) {
  return (
    <div className="flex justify-between items-center w-full gap-2">
      <h1
        className="text-[25px] sm:text-[30px] lg:text-[35px] font-semibold font-sans truncate"
        style={{
          maxWidth: "70%", // จำกัดความกว้าง
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {activity.name}
      </h1>
      <div
  className="flex items-center gap-1 text-[20px] sm:text-[25px] lg:text-[30px] cursor-pointer"
  style={{ pointerEvents: "none" }}
>
  {activity.location_type === "Course"
    ? "-" // ✅ ถ้าเป็น course แสดง "-"
    : `${activity.registered_count}/${activity.seat}`}{" "}
  <User className="w-[25px] h-[25px] sm:w-[30px] sm:h-[30px] lg:w-[35px] lg:h-[35px]" />
</div>

    </div>
  );
}
