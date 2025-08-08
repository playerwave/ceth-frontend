import React, { useState } from "react";
import CustomCard from "../../../components/Card";
import Button from "../../../components/Button";

function AssessmentStudent() {
  const questions = [
    "1.1 ความรู้ความเข้าใจในเรื่องนี้ก่อนการอบรม",
    "1.2 ความรู้ความเข้าใจในเรื่องนี้หลังการอบรม",
    "1.3 ท่านได้รับความรู้ แนวคิด ประสบการณ์ใหม่จากโครงการ",
    "1.4 ท่านสามารถนำสิ่งที่ได้รับจากโครงการนี้ไปใช้ประโยชน์ในการปฏิบัติงานในอนาคต",
    "1.5 รูปแบบและวิธีอบรมมีความเหมาะสมกับสถานการณ์ปัจจุบัน",
  ];

  // สำหรับแบบเลือกคำตอบเดียว (radio)
  const radioOptions = [
    "มากที่สุด",
    "มาก",
    "ปานกลาง",
    "น้อย",
    "น้อยที่สุด",
    "ค่าเฉลี่ย",
  ];

  const [radioAnswers, setRadioAnswers] = useState<{ [key: number]: string }>(
    {}
  );

  const handleChange = (qIndex: number, value: string) => {
    setRadioAnswers((prev) => ({
      ...prev,
      [qIndex]: value,
    }));
  };

  // Checkbox
  const checkboxOptions = [
    "ตัวเลือกที่ 1",
    "ตัวเลือกที่ 2",
    "ตัวเลือกที่ 3",
    "ตัวเลือกที่ 4",
  ];
  const [checkboxAnswers, setCheckboxAnswers] = useState<{
    [key: number]: string[];
  }>({});

  const toggleCheckbox = (qIndex: number, option: string) => {
    setCheckboxAnswers((prev) => {
      const current = prev[qIndex] || [];
      const isChecked = current.includes(option);
      return {
        ...prev,
        [qIndex]: isChecked
          ? current.filter((opt) => opt !== option)
          : [...current, option],
      };
    });
  };

  //แบบข้อความ
  const examOptions = [
    "ตัวเลือกที่ 1",
    "ตัวเลือกที่ 2",
    "ตัวเลือกที่ 3",
    "ตัวเลือกที่ 4",
  ];
  const [examAnswers, setExamAnswers] = useState<{ [key: number]: string }>({});
  const handleExamChange = (qIndex: number, value: string) => {
    setExamAnswers((prev) => ({
      ...prev,
      [qIndex]: value,
    }));
  };

  // แบบคำถามปลายเปิด
  const questionsAns = ["ความรู้ความเข้าใจในเรื่องนี้ก่อนการอบรม"];
  const [openEndedAnswers, setOpenEndedAnswers] = useState<{
    [key: number]: string;
  }>({});

  const handleOpenEndedChange = (qIndex: number, value: string) => {
    setOpenEndedAnswers((prev) => ({
      ...prev,
      [qIndex]: value,
    }));
  };

  return (
    <div className="ml-25 mr-5">
      {/* แบบตัวเลือก */}
      <CustomCard
        className="w-full
                  max-w-[90vw]         
                  sm:max-w-[600px]     
                  md:max-w-[700px]     
                  lg:max-w-[100%]
                  p-4 sm:p-6
                  relative
                  mx-0
                  self-start"
      >
        <h2 className="font-bold text-2xl pr-12 leading-snug">
          หัวข้อ: ประเมินผลเนื้อหาการอบรม (ตรงนี้เป็นชื่อหัวเรื่องคำถาม)
          ตัวอย่างคำถามแบบพึงพอใจ
        </h2>
        <br />
        <div className="w-full overflow-x-auto">
          <table className="w-full text-[16px] table-auto min-w-[600px] border-collapse">
            <thead>
              <tr className="text-left text-[#A0AEC0]">
                <th className="p-2">คำถาม</th>
                {radioOptions.map((opt, idx) => (
                  <th key={idx} className="p-2 text-center">
                    {opt}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {questions.map((q, qIndex) => (
                <tr key={qIndex}>
                  <td className="p-2">{q}</td>
                  {radioOptions.map((opt, optIndex) => (
                    <td key={optIndex} className="p-2 text-center">
                      <input
                        type="radio"
                        name={`q-${qIndex}`}
                        value={opt}
                        checked={radioAnswers[qIndex] === opt}
                        onChange={() => handleChange(qIndex, opt)}
                        className="w-4 h-4 accent-blue-500"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CustomCard>
      <br />

      {/* แบบหลายตัวเลือก */}
      <CustomCard className="w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[100%] p-4 sm:p-6 relative mx-0 self-start">
        <h2 className="font-bold text-2xl pr-12 leading-snug">
          ตัวอย่างคำถามแบบหลายตัวเลือก (Checkbox)
        </h2>
        <div className="space-y-6 mt-4">
          {questions.map((q, qIndex) => (
            <div key={qIndex}>
              <p className="mb-2 text-[16px] text-gray-800">{q}</p>
              <div className="flex flex-col gap-2">
                {checkboxOptions.map((opt, optIndex) => (
                  <label key={optIndex} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={opt}
                      checked={checkboxAnswers[qIndex]?.includes(opt) || false}
                      onChange={() => toggleCheckbox(qIndex, opt)}
                      className="accent-green-600 w-4 h-4"
                    />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CustomCard>
      <br />

      {/* แบบข้อความ */}
      <CustomCard
        className="w-full
            max-w-[90vw]         
            sm:max-w-[600px]     
            md:max-w-[700px]     
            lg:max-w-[100%]
            p-4 sm:p-6
            relative
            mx-0
            self-start"
      >
        <h2 className="font-bold text-2xl pr-12 leading-snug">
          ตัวอย่างคำถามตอบแบบข้อความ
        </h2>
        <br />
        <div className="w-full overflow-x-auto">
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div key={qIndex}>
                <p className="text-[16px] mb-2">{q}</p>
                <div className="flex flex-col gap-2">
                  {examOptions.map((option, optIndex) => (
                    <label key={optIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`exam-${qIndex}`}
                        value={option}
                        checked={examAnswers[qIndex] === option}
                        onChange={() => handleExamChange(qIndex, option)}
                        className="accent-purple-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CustomCard>

      <br />

      {/* แบบตัวอย่างคำถามปลายเปิด */}
      <CustomCard
        className="w-full
            max-w-[90vw]         
            sm:max-w-[600px]     
            md:max-w-[700px]     
            lg:max-w-[100%]
            p-4 sm:p-6
            relative
            mx-0
            self-start"
      >
        <h2 className="font-bold text-2xl pr-12 leading-snug">
          ตัวอย่างคำถามปลายเปิด
        </h2>
        <br />
        <div className="w-full overflow-x-auto">
          <div className="space-y-6">
            {questionsAns.map((q, qIndex) => (
              <div key={qIndex}>
                <p className="text-[16px] mb-2">{q}</p>
                <br />
                <textarea
                  className={`
                      w-full
                      border-b border-gray-300
                      focus:outline-none focus:border-[#1E3A8A]
                      ${openEndedAnswers[qIndex] ? "text-black" : "text-gray-400"}
                      placeholder-gray-400
                      resize-none
                      pb-1
                    `}
                  rows={1}
                  placeholder="พิมพ์คำตอบของคุณที่นี่..."
                  value={openEndedAnswers[qIndex] || ""}
                  onChange={(e) =>
                    handleOpenEndedChange(qIndex, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </CustomCard>
      <br />

      <div className="flex justify-center">
        <Button>Submit</Button>
      </div>
    </div>
  );
}

export default AssessmentStudent;
