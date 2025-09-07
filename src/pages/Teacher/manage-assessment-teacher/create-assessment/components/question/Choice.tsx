import React from "react";
import OptionList from "../OptionList";
import { Question } from "../../type/type.create";

interface Props {
  sectionId: number;
  question: Question;
  mode: "create" | "edit"; // 👈 ตรงนี้ถูกแล้ว
}

const Choice: React.FC<Props> = ({ sectionId, question , mode}) => {
  return (
    <OptionList
      sectionId={sectionId}
      question={question}
      mode={mode} // ✅ ใช้งานได้แล้ว
    />
  );
};

export default Choice;
