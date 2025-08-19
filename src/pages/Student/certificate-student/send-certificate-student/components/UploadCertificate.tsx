import { useState, useEffect } from "react";
import { ImagePlus } from "lucide-react";

interface UploadCertificateProps {
  previewImage: string | null;
  setPreviewImage: (url: string | null) => void;
  disabled: boolean;
}

export default function UploadCertificate({
  previewImage,
  setPreviewImage,
  disabled,
}: UploadCertificateProps) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }
  }

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  return (
    <div className="mt-10">
      <div className="mt-10">
        <label className="font-semibold">แนบไฟล์ :</label>
        <input
          id="fileUpload"
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          disabled={disabled}
          className="ml-4 inline-block rounded border border-[#9D9D9D] px-3 py-2 w-[200px] sm:w-[300px] md:w-[400px]"
        />
      </div>

      <div className="flex justify-center mt-4">
        <div className="w-full max-w-[750px]">
          <div className="relative w-full aspect-[750/519] rounded-lg border bg-white shadow">
            <label
              htmlFor="fileUpload"
              className={`absolute inset-0 rounded-lg flex items-center justify-center ${
                disabled
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-50"
              } transition`}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="รูปภาพเกียรติบัตร"
                  className="h-full w-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <ImagePlus size={40} className="mx-auto" />
                  <p className="mt-2 text-sm">อัปโหลดเกียรติบัตร</p>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
