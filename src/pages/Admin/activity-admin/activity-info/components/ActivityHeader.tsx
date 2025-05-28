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
    <div className="flex justify-between items-center w-full gap-2">
  <h1
    className="text-[25px] sm:text-[30px] lg:text-[35px] font-semibold font-sans truncate"
    style={{
      maxWidth: "70%",         // จำกัดความกว้าง
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }}
  >
    {name}
  </h1>

  <div
    className={`flex items-center gap-1 text-[20px] sm:text-[25px] lg:text-[30px]  ${
      onClickRegistered ? "cursor-pointer" : "cursor-default text-gray-500"
    }`}
    onClick={() => {
      if (onClickRegistered) onClickRegistered();
    }}
  >
    <span>
      {registeredCount === "-" ? "-" : `${registeredCount}/${seat}`}
    </span>
    <User className="w-[25px] h-[25px] sm:w-[30px] sm:h-[30px] lg:w-[35px] lg:h-[35px]" />
  </div>
</div>

  );
}
