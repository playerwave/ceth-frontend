interface OcrResultProps {
  result: {
    fullName?: string;
    courseName?: string;
    teacher?: string;
    certificateId?: string;
    rawText?: string;
    date?: string;
  } | null;
}

export default function OcrResult({ result }: OcrResultProps) {
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1 p-0 lg:p-4">
        <div className="flex flex-col md:flex-row mb-2">
          <p className="font-bold w-36 lg:w-40 shrink-0">ชื่อ-นามสกุล:</p>
          <p className="flex-1 break-words">{result?.fullName || "-"}</p>
        </div>
        <div className="flex flex-col md:flex-row mb-2">
          <p className="font-bold w-36 lg:w-40 shrink-0">ชื่อหลักสูตร:</p>
          <p className="flex-1 break-words">{result?.courseName || "-"}</p>
        </div>
        <div className="flex flex-col md:flex-row mb-2">
          <p className="font-bold w-36 lg:w-40 shrink-0">ชื่ออาจารย์:</p>
          <p className="flex-1 break-words">{result?.teacher || "-"}</p>
        </div>
      </div>

      <div className="flex-1 p-0 lg:p-4">
        <div className="flex flex-col md:flex-row mb-2">
          <p className="font-bold w-36 lg:w-40 shrink-0">Date:</p>
          <p className="flex-1 break-words">{result?.date || "-"}</p>
        </div>
        <div className="flex flex-col md:flex-row mb-2">
          <p className="font-bold w-36 lg:w-40 shrink-0">Certificate ID:</p>
          <p className="flex-1">{result?.certificateId || "-"}</p>
        </div>

        {!result && <p className="text-gray-500">ยังไม่มีผลลัพธ์ OCR</p>}

        {result && (() => {
          const isComplete =
            result.fullName !== "-" &&
            result.courseName !== "-" &&
            result.teacher !== "-" &&
            result.date !== "-" &&
            result.certificateId !== "-";

          return (
            <p
              className={`font-bold mt-3 ${
                isComplete ? "text-green-500" : "text-red-600"
              }`}
            >
              {isComplete
                ? "ผ่านเกณฑ์การตรวจสอบ ระบบจะทำการเพิ่มคะแนนชั่วโมงอบรมสหกิจให้ตามหลักสูตร"
                : "ไม่ผ่านเกณฑ์ ระบบจะทำการส่งให้อาจารย์ตรวจสอบยืนยัน กรุณารอผลลัพธ์การตรวจสอบ"}
            </p>
          );
        })()}
      </div>
    </div>
  );
}
