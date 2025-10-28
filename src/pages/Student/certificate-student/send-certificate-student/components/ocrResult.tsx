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
    certificateType?: 'THAI_MOOC' | 'BUU_MOOC' | 'UNKNOWN'; // ✅ เพิ่ม certificate type
    organize_name?: string; // ✅ เพิ่ม organize_name
    confidenceScore?: number; // ✅ เพิ่ม confidence score
    verified?: boolean; // ✅ เพิ่ม: ผ่านการตรวจสอบหรือไม่ (จาก backend)
    warning?: boolean; // ✅ เพิ่ม: เตือนถ้ามีข้อมูลไม่ครบ
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
        <div className="flex flex-col md:flex-row mb-2">
          <p className="font-bold w-36 lg:w-40 shrink-0">หน่วยงาน:</p>
          <p className="flex-1 break-words">{result?.organize_name || "-"}</p>
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
        <div className="flex flex-col md:flex-row mb-2">
          <p className="font-bold w-36 lg:w-40 shrink-0">ประเภท:</p>
          <p className="flex-1">
            {result?.certificateType === 'THAI_MOOC' ? 'Thai MOOC' :
             result?.certificateType === 'BUU_MOOC' ? 'BUU MOOC' :
             'ไม่ทราบประเภท'}
          </p>
        </div>
        <div className="flex flex-col md:flex-row mb-2">
          <p className="font-bold w-36 lg:w-40 shrink-0">คะแนนความเชื่อมั่น:</p>
          <p className="flex-1">
            <span className={`font-bold ${
              (result?.confidenceScore || 0) >= 70 ? 'text-green-600' : 
              (result?.confidenceScore || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {result?.confidenceScore ? `${result.confidenceScore.toFixed(1)}%` : "-"}
            </span>
          </p>
        </div>

        {!result && <p className="text-gray-500">ยังไม่มีผลลัพธ์ การประมวลผล</p>}

        {result && (() => {
          const certificateType = result.certificateType || 'UNKNOWN';
          console.log("🔍 OcrResult - Certificate Type:", certificateType);
          
          // ✅ ตรวจสอบข้อมูลที่ขาดหายไป - ปรับตาม certificate type
          const missingFields = [];
          if (result.fullName === "-") missingFields.push("ชื่อ-นามสกุล");
          if (result.courseName === "-") missingFields.push("ชื่อหลักสูตร");
          if (result.teacher === "-") missingFields.push("ชื่ออาจารย์");
          if (result.date === "-") missingFields.push("วันที่");
          
          // ✅ Certificate ID - ตรวจสอบตาม certificate type
          if (certificateType === 'BUU_MOOC' && result.certificateId === "-") {
            missingFields.push("Certificate ID");
          }
          // ✅ Thai MOOC ไม่บังคับ Certificate ID
          
          // ✅ ใช้ verified จาก backend เป็นหลัก (ถ้ามี)
          const isVerified = result.verified ?? false;
          const hasWarning = result.warning ?? false;

          return (
            <div className="mt-3">
              <p
                className={`font-bold ${
                  isVerified ? "text-green-500" : "text-red-600"
                }`}
              >
                {isVerified
                  ? "ผ่านเกณฑ์การตรวจสอบ ระบบจะทำการเพิ่มคะแนนชั่วโมงอบรมสหกิจให้ตามหลักสูตร"
                  : "ไม่ผ่านเกณฑ์ ระบบจะทำการส่งให้อาจารย์ตรวจสอบยืนยัน กรุณารอผลลัพธ์การตรวจสอบ"}
              </p>
              
              {/* ✅ แสดง warning ถ้ามีข้อมูลไม่ครบแต่ผ่าน */}
              {isVerified && hasWarning && missingFields.length > 0 && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-700 font-medium mb-1">
                    ⚠️ ข้อมูลบางส่วนไม่ครบถ้วน:
                  </p>
                  <ul className="text-sm text-yellow-600 list-disc list-inside">
                    {missingFields.map((field, index) => (
                      <li key={index}>ไม่พบข้อมูล: {field}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-yellow-600 mt-2">
                    ใบรับรองได้รับการยืนยันเนื่องจากชื่อตรงกัน แต่ขอแนะนำให้ตรวจสอบข้อมูลที่ขาดหายไป
                  </p>
                </div>
              )}
              
              {/* ✅ แสดงเหตุผลที่ไม่ผ่าน */}
              {!isVerified && missingFields.length > 0 && (
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
