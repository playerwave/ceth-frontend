import { User } from "lucide-react";
import { Activity } from "@/types/activity.types";

interface Props {
  activity: Activity;
}

export default function ActivityHeader( props: Props) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-[35px] font-semibold font-sans">{props.activity.activity_name}</h1>
      {props.activity.event_format !== "Course" && (
        <div
          className="flex items-center text-[25px] gap-[4px] cursor-pointer"
          style={{ pointerEvents: "none" }}
        >
          {props.activity.registered_count}/{props.activity.seat} <User size={40} />
        </div>
      )}
    </div>
  );
}
