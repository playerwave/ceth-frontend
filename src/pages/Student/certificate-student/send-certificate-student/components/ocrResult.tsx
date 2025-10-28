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
    nameVerification?: { // ✅ เพิ่มข้อมูลการตรวจสอบชื่อ
      isValid: boolean;
      certificateName: string;
      studentName: string;
    };
    // ✅ เพิ่มข้อมูลสำหรับลิ้งก์
    isLinkValidation?: boolean; // ✅ ระบุว่าเป็นผลจากลิ้งก์หรือไม่
    linkValidationData?: { // ✅ ข้อมูลการตรวจสอบลิ้งก์
      studentName: string;
      courseName: string;
      completionDate: string;
      certificateId: string;
      isValid: boolean;
    };
    [key: string]: unknown;
  } | null;
}

export default function OcrResult({ result }: OcrResultProps) {
  // ✅ ถ้าเป็นลิ้งก์ ให้แสดงแค่กรอบสีเขียว
  if (result?.isLinkValidation && result?.linkValidationData) {
    return (
      <div className="w-full">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-green-800 ml-2">
              ผลการตรวจสอบลิ้งก์
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">ชื่อนิสิต:</p>
              <p className="text-sm text-green-600">{result.linkValidationData.studentName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">ชื่อหลักสูตร:</p>
              <p className="text-sm text-green-600">{result.linkValidationData.courseName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">วันที่สำเร็จ:</p>
              <p className="text-sm text-green-600">{result.linkValidationData.completionDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">ประเภท:</p>
              <p className="text-sm text-green-600">BUU MOOC</p>
            </div>
          </div>
          
          <div className="mt-3 flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              result.linkValidationData.isValid 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {result.linkValidationData.isValid ? '✅ ข้อมูลถูกต้อง' : '❌ ข้อมูลไม่ถูกต้อง'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ✅ ถ้าไม่ใช่ลิ้งก์ ให้แสดงผล OCR ปกติ
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

        {/* ✅ แสดงข้อความแจ้งเตือนเมื่อชื่อไม่ตรง */}
        {result?.nameVerification && !result.nameVerification.isValid && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  ⚠️ ชื่อในใบรับรองไม่ตรงกับข้อมูลในระบบ
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p><strong>ชื่อในใบรับรอง:</strong> {result.nameVerification.certificateName}</p>
                  <p><strong>ชื่อในระบบ:</strong> {result.nameVerification.studentName}</p>
                  <p className="mt-2">กรุณาตรวจสอบชื่อในใบรับรองให้ตรงกับข้อมูลในระบบ หรือติดต่อเจ้าหน้าที่เพื่อขอความช่วยเหลือ</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
