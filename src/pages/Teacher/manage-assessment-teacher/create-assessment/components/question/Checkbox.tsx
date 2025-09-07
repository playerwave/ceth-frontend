import React from "react";
import OptionList from "../OptionList";
import { Question } from "../../type/type.create";

interface Props {
  sectionId: number;
  question: Question;
  mode: "create" | "edit"; // 👈 ตรงนี้ถูกแล้ว
}

const CheckboxQuestion: React.FC<Props> = ({ sectionId, question, mode }) => { // ✅ ดึง mode มาด้วย
  return (
    <OptionList
      sectionId={sectionId}
      question={question}
      mode={mode} // ✅ ใช้งานได้แล้ว
    />
  );
};

export default CheckboxQuestion;
