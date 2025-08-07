export type QuestionBase = {
  id: number;
  question: string;
};

export type ChoiceQuestion = QuestionBase & {
  type: "choice";
  choices: string[];
};

export type CheckboxQuestion = QuestionBase & {
  type: "checkbox";
  choices: string[];
};

export type OpenQuestion = QuestionBase & {
  type: "openques";
};

export type ComplacentQuestion = QuestionBase & {
  type: "complacent";
};



export type QuestionItem =
  | ChoiceQuestion
  | CheckboxQuestion
  | OpenQuestion
    | ComplacentQuestion;

export type TopicData = {
  topic: string;
  questions: QuestionItem[];
};
