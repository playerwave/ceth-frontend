import { useState } from "react";
import Dialog2 from "../../../../components/Dialog/Dialog2";
import { AlertCircle } from "lucide-react";

const previewCertificateTeacher = () => {

  const [open, setOpen] = useState(false);
  const mockData = {
    fullName: "Yanakorn Banphanuk",
    courseName: "Data Visualization with Tableau Desktop",
    instructor: "สุรีรัตน์ สุขวิมล",
    certificateId: "97c5a568556149808Z0a0683da8d93",
    confidenceScore: 82.87,
    issueDate: "4 ธันวาคม 2024",
    platform: "BUU MOOC",
  };

  const handleConfirm = () => {
    // ทำการยืนยันจริง เช่นเรียก API
    setOpen(false);
    alert("ยืนยันเรียบร้อยแล้ว!");
  };

  return (
    <div className="max-w-[1700px] h-[950px] mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg font-sans">
      <h1 className="text-2xl font-bold mb-6 text-center">🎓 Preview Certificate</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Image (2/3 width) */}
        <div className="md:col-span-2 flex items-center justify-center border  shadow-sm bg-gray-100">
          <div className="w-full h-[700px] bg-gray-300 flex items-center justify-center text-gray-600 text-sm italic">
            รูปภาพ Certificate
          </div>
        </div>

        {/* Right: Info (1/3 width) */}
        <div className="border p-4 shadow-sm bg-gray-50 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-4">📄 รายละเอียดใบรับรอง</h2>
            <div className="space-y-2 text-sm">
              <p className="text-xl "><strong>ชื่อผู้รับ:</strong> {mockData.fullName}</p>
              <p className="text-xl "><strong>หลักสูตร:</strong> {mockData.courseName}</p>
              <p className="text-xl "><strong>ชื่ออาจารย์:</strong> {mockData.instructor}</p>
              <p className="text-xl "><strong>Certificate ID:</strong> {mockData.certificateId}</p>
              <p className="text-xl "><strong>Confidence Score:</strong> {mockData.confidenceScore}%</p>
              <p className="text-xl "><strong>วันที่ออก:</strong> {mockData.issueDate}</p>
              <p className="text-xl "><strong>แพลตฟอร์ม:</strong> {mockData.platform}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-between gap-4">
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">
              ย้อนกลับ
            </button>
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
              ยืนยัน
            </button>

          </div>
        </div>
      </div>
      {/* Confirmation Dialog */}
      <Dialog2
        open={open}
        title="ยืนยันความถูกต้องเกียรติบัตร"
        message={
          <>
            <p className="text-sm text-gray-700">
              คุณแน่ใจหรือไม่ต้องการยืนยันเกียรติบัตรนี้
            </p>
            <p className="text-sm text-red-500 mt-2">
              หากยืนยันผลสำเร็จและไม่สามารถกลับมาแก้ไขได้แล้ว *
            </p>
          </>
        }

        icon={<AlertCircle className="w-6 h-6 text-red-500" />}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
      />


    </div>
  );
};

export default previewCertificateTeacher;
