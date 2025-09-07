import React from "react";
import OptionList from "../OptionList";
import { Question } from "../../type/type.create";

interface Props {
  sectionId: number;
  question: Question;
}

const Choice: React.FC<Props> = ({ sectionId, question }) => {
  return (
    <OptionList
      sectionId={sectionId}
      question={question}
      mode="create"   // 👈 ใส่ mode
    />
  );
};

export default Choice;
