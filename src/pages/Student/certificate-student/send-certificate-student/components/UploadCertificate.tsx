import { useEffect } from "react";
import { ImagePlus, X } from "lucide-react";

interface UploadCertificateProps {
  previewImage: string | null;
  setPreviewImage: (url: string | null) => void;
  setFile: (file: File | null) => void;
  file: File | null;      // <--- ต้องส่งเข้ามาด้วย
  disabled: boolean;
}

export default function UploadCertificate({
  previewImage,
  setPreviewImage,
  setFile,
  file,
  disabled,
}: UploadCertificateProps) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (!f) return;

    if (f.type.startsWith("image/") || f.type === "application/pdf") {
      setPreviewImage(URL.createObjectURL(f));
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
                disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"
              } transition`}
            >
              {previewImage ? (
                <>
                  {file?.type === "application/pdf" ? (
                    <embed
                      src={previewImage}
                      type="application/pdf"
                      className="h-full w-full rounded-lg"
                    />
                  ) : (
                    <img
                      src={previewImage}
                      alt="รูปภาพเกียรติบัตร"
                      className="h-full w-full object-contain rounded-lg"
                    />
                  )}
                </>
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
