import React from "react";
import { Question } from "../type/type.create";
import Choice from "../components/question/Choice";
import CheckboxQuestion from "../components/question/Checkbox";
import TextQuestion from "../components/question/Text";
import RatingQuestion from "../components/question/Rating";

interface QuestionRendererProps {
  sectionId: number;
  question: Question;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ sectionId, question }) => {
  switch (question.type) {
    case "choice":
      return <Choice sectionId={sectionId} question={question} />;
    case "checkbox":
      return <CheckboxQuestion sectionId={sectionId} question={question} />;
    case "text":
      return <TextQuestion />;
    case "rating":
      return <RatingQuestion />;
    default:
      return null;
  }
};

export default QuestionRenderer;
