import React from "react";
import OptionList from "../OptionList";
import { Question } from "../../type/type.create";

interface Props {
  sectionId: number;
  question: Question;
}

const CheckboxQuestion: React.FC<Props> = ({ sectionId, question }) => {
  return (
    <OptionList
      sectionId={sectionId}
      question={question}
    />
  );
};

export default CheckboxQuestion;
