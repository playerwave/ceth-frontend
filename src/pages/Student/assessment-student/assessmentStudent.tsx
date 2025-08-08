import React, { useState } from "react";
import Button from "../../../components/Button";

import SatisfactionQuestions from "./components/SatisfactionQuestions";
import MultipleChoice from "./components/MultipleChoice";
import ChoiceAnswer from "./components/ChoiceAnswer";
import OpenEndedQuestion from "./components/OpenEndedQuestion";

function AssessmentStudent() {
  const questions = [
    "1.1 ความรู้ความเข้าใจในเรื่องนี้ก่อนการอบรม",
    "1.2 ความรู้ความเข้าใจในเรื่องนี้หลังการอบรม",
    "1.3 ท่านได้รับความรู้ แนวคิด ประสบการณ์ใหม่จากโครงการ",
    "1.4 ท่านสามารถนำสิ่งที่ได้รับจากโครงการนี้ไปใช้ประโยชน์ในการปฏิบัติงานในอนาคต",
    "1.5 รูปแบบและวิธีอบรมมีความเหมาะสมกับสถานการณ์ปัจจุบัน",
  ];

  // Matrix radio (ความพึงพอใจ)
  const radioOptions = ["มากที่สุด", "มาก", "ปานกลาง", "น้อย", "น้อยที่สุด", "ค่าเฉลี่ย"];
  const [radioAnswers, setRadioAnswers] = useState<{ [key: number]: string }>({});
  const handleSatisfactionChange = (qIndex: number, value: string) =>
    setRadioAnswers((prev) => ({ ...prev, [qIndex]: value }));

  // Checkbox
  const checkboxOptions = ["ตัวเลือกที่ 1", "ตัวเลือกที่ 2", "ตัวเลือกที่ 3", "ตัวเลือกที่ 4"];
  const [checkboxAnswers, setCheckboxAnswers] = useState<{ [key: number]: string[] }>({});
  const toggleCheckbox = (qIndex: number, option: string) =>
    setCheckboxAnswers((prev) => {
      const current = prev[qIndex] || [];
      const isChecked = current.includes(option);
      return { ...prev, [qIndex]: isChecked ? current.filter((o) => o !== option) : [...current, option] };
    });

  // Radio ปกติ (ChoiceAnswer)
  const examOptions = ["ตัวเลือกที่ 1", "ตัวเลือกที่ 2", "ตัวเลือกที่ 3", "ตัวเลือกที่ 4"];
  const [examAnswers, setExamAnswers] = useState<{ [key: number]: string }>({});
  const handleExamChange = (qIndex: number, value: string) =>
    setExamAnswers((prev) => ({ ...prev, [qIndex]: value }));

  // ปลายเปิด
  const openEndedQuestions = ["ความรู้ความเข้าใจในเรื่องนี้ก่อนการอบรม"];
  const [openEndedAnswers, setOpenEndedAnswers] = useState<{ [key: number]: string }>({});
  const handleOpenEndedChange = (qIndex: number, value: string) =>
    setOpenEndedAnswers((prev) => ({ ...prev, [qIndex]: value }));

  const handleSubmit = () => {
    // รวมคำตอบไว้ที่เดียว (ตามจริงคุณอาจส่งไป API)
    const payload = {
      satisfaction: radioAnswers,
      multipleChoice: checkboxAnswers,
      choiceAnswer: examAnswers,
      openEnded: openEndedAnswers,
    };
    console.log("Submit payload:", payload);
    // TODO: call API
  };

  return (
    <div className="ml-25 mr-5">
      <SatisfactionQuestions
        questions={questions}
        options={radioOptions}
        answers={radioAnswers}
        onChange={handleSatisfactionChange}
      />

      <br />

      <MultipleChoice
        questions={questions}
        options={checkboxOptions}
        answers={checkboxAnswers}
        onToggle={toggleCheckbox}
      />

      <br />

      <ChoiceAnswer
        questions={questions}
        options={examOptions}
        answers={examAnswers}
        onChange={handleExamChange}
      />

      <br />

      <OpenEndedQuestion
        questions={openEndedQuestions}
        answers={openEndedAnswers}
        onChange={handleOpenEndedChange}
      />

      <br />

      <div className="flex justify-center">
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}

export default AssessmentStudent;
