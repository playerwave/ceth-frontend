import React from "react";
import OptionList from "../OptionList";
import { Section, Question } from "../../type/type.create";

interface Props {
  sectionId: number;
  question: Question;
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
}

const Checkbox: React.FC<Props> = ({ sectionId, question, sections, setSections }) => {
  return (
    <OptionList
      sectionId={sectionId}
      question={question}
      sections={sections}
      setSections={setSections}
    />
  );
};

export default Checkbox;
