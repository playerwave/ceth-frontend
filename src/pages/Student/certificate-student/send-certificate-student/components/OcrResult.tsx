interface OcrResultProps {
  result: {
    fullName: string;
    courseName: string;
    teacher: string;
    certificateId: string;
    score: string;
  };
}

export default function OcrResult({ result }: OcrResultProps) {
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1 p-0 lg:p-4">
        <div className="flex flex-col md:flex-row mb-2">
          <p className="font-bold w-36 lg:w-40 shrink-0">ชื่อ-นามสกุล:</p>
          <p className="flex-1 break-words">{result.fullName}</p>
        </div>
        <div className="flex flex-col md:flex-row mb-2">
          <p className="font-bold w-36 lg:w-40 shrink-0">ชื่อหลักสูตร:</p>
          <p className="flex-1 break-words">{result.courseName}</p>
        </div>
        <div className="flex flex-col md:flex-row mb-2">
          <p className="font-bold w-36 lg:w-40 shrink-0">ชื่ออาจารย์:</p>
          <p className="flex-1 break-words">{result.teacher}</p>
        </div>
      </div>

      <div className="flex-1 p-0 lg:p-4">
        <div className="flex flex-col md:flex-row mb-2">
          <p className="font-bold w-36 lg:w-40 shrink-0">Certificate ID:</p>
          <p className="flex-1 break-words">{result.certificateId}</p>
        </div>
        <div className="flex flex-col md:flex-row mb-2">
          <p className="font-bold w-36 lg:w-40 shrink-0">Confidence Score:</p>
          <p className="flex-1">{result.score}</p>
        </div>
        <p className="text-red-600 font-bold mt-3">
          ไม่ผ่านเกณฑ์ ระบบจะทำการส่งให้อาจารย์ตรวจสอบยืนยัน กรุณารอผลลัพธ์การตรวจสอบ
        </p>
      </div>
    </div>
  );
}
