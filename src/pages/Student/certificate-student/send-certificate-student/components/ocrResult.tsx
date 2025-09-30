interface OcrResultProps {
  result: {
    fullName?: string;
    courseName?: string;
    teacher?: string;
    certificateId?: string;
    rawText?: string;
    date?: string;
    score?: string;
    score_float?: number;
    [key: string]: unknown;
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

          // ✅ ตรวจสอบข้อมูลที่ขาดหายไป
          const missingFields = [];
          if (result.fullName === "-") missingFields.push("ชื่อ-นามสกุล");
          if (result.courseName === "-") missingFields.push("ชื่อหลักสูตร");
          if (result.teacher === "-") missingFields.push("ชื่ออาจารย์");
          if (result.date === "-") missingFields.push("วันที่");
          if (result.certificateId === "-") missingFields.push("Certificate ID");

          return (
            <div className="mt-3">
              <p
                className={`font-bold ${
                  isComplete ? "text-green-500" : "text-red-600"
                }`}
              >
                {isComplete
                  ? "ผ่านเกณฑ์การตรวจสอบ ระบบจะทำการเพิ่มคะแนนชั่วโมงอบรมสหกิจให้ตามหลักสูตร"
                  : "ไม่ผ่านเกณฑ์ ระบบจะทำการส่งให้อาจารย์ตรวจสอบยืนยัน กรุณารอผลลัพธ์การตรวจสอบ"}
              </p>
              
              {/* ✅ แสดงเหตุผลที่ไม่ผ่าน */}
              {!isComplete && missingFields.length > 0 && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700 font-medium mb-1">
                    เหตุผลที่ไม่ผ่าน:
                  </p>
                  <ul className="text-sm text-red-600 list-disc list-inside">
                    {missingFields.map((field, index) => (
                      <li key={index}>ไม่พบข้อมูล: {field}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-red-500 mt-2">
                    💡 กรุณาตรวจสอบว่าไฟล์ที่อัปโหลดเป็นใบรับรองที่ถูกต้องและมีข้อมูลครบถ้วน
                  </p>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
