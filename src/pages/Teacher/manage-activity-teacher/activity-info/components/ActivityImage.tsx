import { ImageOff } from "lucide-react";

interface Props {
  imageUrl?: string | null;
}

export default function ActivityImage({ imageUrl }: Props) {
  const isDefault =
    !imageUrl || imageUrl === "" || imageUrl === "/img/default.png";

  if (isDefault) {
    return (
      <div className="flex items-center justify-center bg-gray-100 w-full h-130 text-sm text-black-500 border border-black rounded-lg mt-4">
        <div className="text-center text-black-400">
          <ImageOff size={60} className="mx-auto" />
          <p className="text-xl mt-2">ไม่มีรูปภาพสำหรับกิจกรรมนี้</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full h-130 bg-white border border-black rounded-lg mt-4">
      <img
        src={imageUrl}
        alt="Activity"
        className="w-full h-full object-cover rounded-lg"
        onError={(e) => (e.currentTarget.src = "/img/default.png")}
      />
    </div>
  );
}
