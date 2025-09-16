// Activity Report Types
export interface ChoiceStat {
  choiceText: string;
  count: number;
  percentage: string;
}

export interface AssessmentChoice {
  choiceId: number;
  choiceText: string;
  count?: number;
  percentage?: string;
}

export interface AssessmentQuestionData {
  questionId: number;
  questionText: string;
  questionType: "Fix Single answer" | "Single answer" | "Multiple answer" | "Text answer";
  questionNumber: number;
  setNumberId?: number;
  choices?: AssessmentChoice[];
  choiceStats?: ChoiceStat[];
  totalAnswers?: number;
  totalRespondents?: number;
  average?: number;
  answers?: string[];
  // For Fix Single answer
  most?: number;
  much?: number;
  medium?: number;
  less?: number;
  least?: number;
}

export interface AssessmentTopic {
  topicId: number;
  topicName: string;
  questions: AssessmentQuestionData[];
  pieData?: PieChartData[];
  totalRespondents?: number;
}

export interface PieChartData {
  name: string;
  value: number | string;
  color: string;
}

// Enrollment Data Types
export interface DepartmentData {
  department: string;
  year1: number;
  year2: number;
  year3: number;
  year4: number;
}

export interface EnrollmentLegend {
  name: string;
  color: string;
}

export interface EnrollmentData {
  departments: DepartmentData[];
  legend: EnrollmentLegend[];
  totalText: string;
}

// Participation Data Types
export interface ParticipationItem {
  label: string;
  count: number;
  percent: string;
}

export interface StudentStatusItem {
  label: string;
  count: number;
  percent: string;
}

export interface RegisteredInfo {
  label: string;
  count: number;
  percent: string;
}

export interface ParticipationData {
  participationData: ParticipationItem[];
  studentStatusData: StudentStatusItem[];
  totalRegistered: number;
  registeredInfo?: RegisteredInfo;
  fullTimeAttendance?: number;
}

// Satisfaction Survey Types
export interface SatisfactionSurveyData {
  pieData: PieChartData[];
  totalRespondents: number;
}

// Student Assessment Status Types
export interface EvaluationStatusItem {
  label: string;
  count: number;
  percent: string;
}

export interface StudentAssessmentStatusData {
  evaluationStatusData: EvaluationStatusItem[];
  totalText: string;
}

// Feedback Data Types
export interface FeedbackItem {
  comment: string;
  department: string;
}
