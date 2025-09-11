import CustomCard from "../../../../../components/Card";

const summaryTableData = [
  {
    question: "1.1 ความรู้ความเข้าใจในเรื่องนี้ก่อนการอบรม",
    most: 47,
    much: 31,
    medium: 20,
    less: 3,
    least: 0,
    average: 4.21,
  },
  {
    question: "1.2 ความรู้ความเข้าใจในเรื่องนี้หลังการอบรม",
    most: 63,
    much: 34,
    medium: 3,
    less: 1,
    least: 0,
    average: 4.57,
  },
  {
    question: "1.3 ท่านได้รับความรู้แนวคิด ประสบการณ์ใหม่จากโครงการ",
    most: 64,
    much: 30,
    medium: 6,
    less: 1,
    least: 0,
    average: 4.55,
  },
  {
    question:
      "1.4 ท่านสามารถนำสิ่งที่ได้รับจากโครงการนี้ไปใช้ประโยชน์ในการปฏิบัติงานในอนาคต",
    most: 68,
    much: 26,
    medium: 6,
    less: 1,
    least: 0,
    average: 4.59,
  },
  {
    question: "1.5 รูปแบบและวิธีอบรมมีความเหมาะสมกับสถานการณ์ปัจจุบัน",
    most: 68,
    much: 26,
    medium: 6,
    less: 1,
    least: 0,
    average: 4.59,
  },
];

const summaryTableData2 = [
  {
    question: "2.1 สมมติว่าเป็นคำถามข้อ2.1",
    most: 47,
    much: 31,
    medium: 20,
    less: 3,
    least: 0,
    average: 4.21,
  },
  {
    question: "2.2 สมมติว่าเป็นคำถามข้อ2.2",
    most: 63,
    much: 34,
    medium: 3,
    less: 1,
    least: 0,
    average: 4.57,
  },
  {
    question: "2.3 สมมติว่าเป็นคำถามข้อ2.3",
    most: 64,
    much: 30,
    medium: 6,
    less: 1,
    least: 0,
    average: 4.55,
  },
  {
    question: "2.4 สมมติว่าเป็นคำถามข้อ2.4",
    most: 68,
    much: 26,
    medium: 6,
    less: 1,
    least: 0,
    average: 4.59,
  },
  {
    question: "2.5 สมมติว่าเป็นคำถามข้อ2.5",
    most: 68,
    much: 26,
    medium: 6,
    less: 1,
    least: 0,
    average: 4.59,
  },
];

const feedbackData = [
  { comment: "ข้าวอร่อยมากครับ", department: "CS" },
  { comment: "ควรหน้าขอไข่ดาวด้วยครับ", department: "SE" },
  { comment: "พิธีกรหล่อมากค่ะ :)", department: "AI" },
];

export default function SetNumberAssessmentDataCard() {
  return (
    <div className="space-y-8 mt-15 mb-15">
      <h1 className="text-2xl font-bold">สรุปผลแบบประเมิน</h1>

      {/* ตารางผลการประเมิน - หัวข้อ 1 */}
      <CustomCard
        className="w-full
                max-w-[90vw]         // ✅ ขนาดที่กำหนดเอง สำหรับหน้าจอเล็ก (ต่ำกว่า md)
                sm:max-w-[600px]     // ✅ เมื่อ ≥ 640px (sm)
                md:max-w-[700px]     // ✅ เมื่อ ≥ 768px (md)
                lg:max-w-[100%]
                p-4 sm:p-6 relative
                mx-0 self-start
                shadow-lg"
      >
        <h3 className="font-bold text-lg mb-4">
          หัวข้อ: 1. ประเมินผลเนื้อหาการอบรม
        </h3>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm table-auto min-w-[600px]">
            <thead>
              <tr className="text-left text-[#A0AEC0]">
                <th className="p-2">คำถาม</th>
                <th className="p-2 text-center">มากที่สุด</th>
                <th className="p-2 text-center">มาก</th>
                <th className="p-2 text-center">ปานกลาง</th>
                <th className="p-2 text-center">น้อย</th>
                <th className="p-2 text-center">น้อยที่สุด</th>
                <th className="p-2 text-right">ค่าเฉลี่ย</th>
              </tr>
            </thead>
            <tbody>
              {summaryTableData.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2">{item.question}</td>
                  <td className="p-2 text-center">{item.most}</td>
                  <td className="p-2 text-center">{item.much}</td>
                  <td className="p-2 text-center">{item.medium}</td>
                  <td className="p-2 text-center">{item.less}</td>
                  <td className="p-2 text-center">{item.least}</td>
                  <td className="p-2 text-right font-semibold">
                    {item.average.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CustomCard>

      {/* ตารางผลการประเมิน - หัวข้อ 2 */}
      <CustomCard
        className="w-full
                max-w-[90vw]         // ✅ ขนาดที่กำหนดเอง สำหรับหน้าจอเล็ก (ต่ำกว่า md)
                sm:max-w-[600px]     // ✅ เมื่อ ≥ 640px (sm)
                md:max-w-[700px]     // ✅ เมื่อ ≥ 768px (md)
                lg:max-w-[100%]
                p-4 sm:p-6 relative
                mx-0 self-start
                shadow-lg"
      >
        <h3 className="font-bold text-lg mb-4">หัวข้อ: 2. ประเมินวิทยากร</h3>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm table-auto min-w-[600px]">
            <thead>
              <tr className="text-left text-[#A0AEC0] font-semibold">
                <th className="p-2">คำถาม</th>
                <th className="p-2 text-center w-[80px]">มากที่สุด</th>
                <th className="p-2 text-center w-[80px]">มาก</th>
                <th className="p-2 text-center w-[80px]">ปานกลาง</th>
                <th className="p-2 text-center w-[80px]">น้อย</th>
                <th className="p-2 text-center w-[80px]">น้อยที่สุด</th>
                <th className="p-2 text-right w-[80px]">ค่าเฉลี่ย</th>
              </tr>
            </thead>
            <tbody>
              {summaryTableData2.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2">{item.question}</td>
                  <td className="p-2 text-center">{item.most}</td>
                  <td className="p-2 text-center">{item.much}</td>
                  <td className="p-2 text-center">{item.medium}</td>
                  <td className="p-2 text-center">{item.less}</td>
                  <td className="p-2 text-center">{item.least}</td>
                  <td className="p-2 text-right font-semibold">
                    {item.average.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CustomCard>

      {/* ตารางข้อเสนอแนะ */}
      <CustomCard
        className="w-full
                max-w-[90vw]         // ✅ ขนาดที่กำหนดเอง สำหรับหน้าจอเล็ก (ต่ำกว่า md)
                sm:max-w-[600px]     // ✅ เมื่อ ≥ 640px (sm)
                md:max-w-[700px]     // ✅ เมื่อ ≥ 768px (md)
                lg:max-w-[100%]
                p-4 sm:p-6 relative
                mx-0 self-start
                shadow-lg"
      >
        <h3 className="font-bold text-lg mb-4">ข้อเสนอแนะจากนิสิต</h3>
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="text-left text-[#A0AEC0] font-semibold">
              <th className="p-2 w-3/4">ข้อเสนอแนะ</th>
              <th className="p-2 w-1/4 text-center">สาขา</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 font-semibold">{item.comment}</td>
                <td className="p-2 text-center font-semibold">
                  {item.department}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CustomCard>
    </div>
  );
}
