import { User } from "lucide-react";

interface Props {
  activity: any;
}

export default function ActivityHeader({ activity }: Props) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-[35px] font-semibold font-sans">{activity.name}</h1>
      <div
        className="flex items-center text-[25px] gap-[4px] cursor-pointer"
        style={{ pointerEvents: "none" }}
      >
        {activity.registered_count}/{activity.seat} <User size={40} />
      </div>
    </div>
  );
}
