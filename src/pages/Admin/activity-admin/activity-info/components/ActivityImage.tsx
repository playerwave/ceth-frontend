import { ImageOff } from "lucide-react";

interface Props {
  imageUrl?: string | null;
}

export default function ActivityImage({ imageUrl }: Props) {
  const isDefault =
    !imageUrl || imageUrl === "" || imageUrl === "/img/default.png";

  if (isDefault) {
    return (
<<<<<<< HEAD
      <div className="flex items-center justify-center bg-gray-100  w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[550px] text-sm text-black-500 border border-black rounded-lg mt-4">
=======
      <div className="flex items-center justify-center bg-gray-100 w-full h-130 text-sm text-black-500 border border-black rounded-lg mt-4">
>>>>>>> 22dcad8d6e1f85fa1dd8833a829d7c2436520b2b
        <div className="text-center text-black-400">
          <ImageOff size={60} className="mx-auto" />
          <p className="text-xl mt-2">ไม่มีรูปภาพสำหรับกิจกรรมนี้</p>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="flex justify-center w-full h-[220px] sm:h-[280px] md:h-[400px] lg:h-[550px] bg-white border border-black rounded-lg mt-4">
=======
    <div className="flex justify-center w-full h-130 bg-white border border-black rounded-lg mt-4">
>>>>>>> 22dcad8d6e1f85fa1dd8833a829d7c2436520b2b
      <img
        src={imageUrl}
        alt="Activity"
        className="w-full h-full object-cover rounded-lg"
        onError={(e) => (e.currentTarget.src = "/img/default.png")}
      />
    </div>
  );
}
