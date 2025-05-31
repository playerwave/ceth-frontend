import { ImageOff } from "lucide-react";

interface Props {
  imageUrl: string | null;
}

export default function ActivityImage({ imageUrl }: Props) {
  const isDefault =
    imageUrl === "/img/default.png" || imageUrl === "" || imageUrl == null;

  return (
    <div className="flex justify-center w-full h-130 bg-white border border-black rounded-lg overflow-hidden mt-4">
      {isDefault ? (
        <div className="flex flex-col items-center justify-center bg-gray-100 w-full h-full text-sm text-black-500">
          <ImageOff size={60} className="mx-auto" />
          <p className="text-xl mt-2">ไม่มีรูปภาพสำหรับกิจกรรมนี้</p>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt="Activity"
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = "/img/default.png")}
        />
      )}
    </div>
  );
}
