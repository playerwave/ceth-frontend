import { User } from "lucide-react";

interface Props {
  name: string;
  registeredCount: number;
  seat: string;
  onClickRegistered: () => void;
}

export default function ActivityHeader({
  name,
  registeredCount,
  seat,
  onClickRegistered,
}: Props) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-[35px] font-semibold font-sans">{name}</h1>
      <div
        className="flex items-center text-[25px] gap-[4px] cursor-pointer"
        onClick={onClickRegistered}
      >
        {registeredCount}/{seat} <User size={40} />
      </div>
    </div>
  );
}
