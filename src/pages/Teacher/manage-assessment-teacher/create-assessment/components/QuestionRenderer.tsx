import React from "react";
import { Section, Question } from "../type/type.create";
import Choice from "../components/question/Choice";
import CheckboxQuestion from "../components/question/Checkbox";
import TextQuestion from "../components/question/Text";
import RatingQuestion from "../components/question/Rating";

interface QuestionRendererProps {
  sectionId: number;
  question: Question;
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ sectionId, question, sections, setSections }) => {
  switch (question.type) {
    case "choice":
      return <Choice sectionId={sectionId} question={question} sections={sections} setSections={setSections} />;

    case "checkbox":
      return <CheckboxQuestion sectionId={sectionId} question={question} sections={sections} setSections={setSections} />;

    case "text":
      return <TextQuestion />;

    case "rating":
      return <RatingQuestion />;

    default:
      return null;
  }
};

export default QuestionRenderer;