//--------------------------- Activity --------------------------------------
export interface Activity {
  activity_id: number;
  activity_name: string;
  presenter_company_name: string;
  type: "Soft" | "Hard";
  description: string;
  seat: number;
  recieve_hours: number;
  event_format: "Online" | "Onsite" | "Course";
  create_activity_date: string; // ISO format (e.g., 2024-06-17T12:00:00Z)
  special_start_register_date: string;
  start_register_date: string;
  end_register_date: string;
  start_activity_date: string;
  end_activity_date: string;
  image_url: string;
  activity_status: "Private" | "Public";
  activity_state:
    | "Not Start"
    | "Special Open Register"
    | "Open Register"
    | "Close Register"
    | "Start Activity"
    | "End Activity"
    | "Start Assessment"
    | "End Assessment";
  status: "Active" | "Inactive";
  last_update_activity_date: string;
  url: string | null;
  assessment_id: number;
  room_id: number;
  start_assessment: string | null;
  end_assessment: string | null;
}

//-----------------------------------------------------------------------------

//--------------------------- ActivityDetail -----------------------------------

export interface ActivityDetail {
  activity_detail_id: number;
  join_id: number;
  activity_id: number;
  activity_food_id: number;
  register_date: string;
  time_in: string;
  time_out: string;
  status: "Registered" | "Cancelled";
}
//-----------------------------------------------------------------------------

//--------------------------- Food --------------------------------------------

export interface Food {
  food_id: number;
  food_name: string;
  status: "Active" | "Inactive";
  faculty_id: number;
}
//-----------------------------------------------------------------------------

//--------------------------- ActivityFood -------------------------------------

export interface ActivityFood {
  activity_food_id: number;
  activity_id: number;
  food_id: number;
}
//-----------------------------------------------------------------------------

//--------------------------- Room --------------------------------------------

export interface Room {
  room_id: number;
  faculty_id: number; // FK to Faculty
  room_name: string;
  floor: string;
  seat_number: number;
  building_id: number; // FK to Building
  status: "Active" | "Available";
}
//-----------------------------------------------------------------------------

//--------------------------- Building ----------------------------------------

export interface Building {
  building_id: number;
  faculty_id: number; // FK to Faculty
  building_name: string;
}
//-----------------------------------------------------------------------------

//--------------------------- Assessment --------------------------------------

export interface Assessment {
  assessment_id: number;
  assessment_name: string;
  description: string;
  create_date: string; // ISO format (e.g., 2024-06-17T12:00:00Z)
  last_update: string; // ISO format (e.g., 2024-06-17T12:00:00Z)
  assessment_status: "Not finished" | "Finished" | "Unsuccessful";
  set_number: number;
  status: "Active" | "Inactive";
}
//-----------------------------------------------------------------------------

//--------------------------- SetNumber ---------------------------------------

export interface SetNumber {
  set_number_id: number;
  name: string;
  status: "Active" | "Inactive";
}
//-----------------------------------------------------------------------------

//--------------------------- Question ----------------------------------------

export interface Question {
  question_id: number;
  question_text: string; // Text of the question
  question_type_id: number; // FK to QuestionType
  question_number: number; // Order of the question in the set
  set_number: number; // FK to SetNumber
}
//-----------------------------------------------------------------------------

//--------------------------- Other Models -------------------------------------

export interface QuestionType {
  question_type_id: number;
  question_type_name: string; // Name of the question type (e.g., 'Multiple Choice', 'Short Answer')
}
//------------------------------------------------------------------------------

//--------------------------- Choice -------------------------------------------
export interface Choice {
  choice_id: number;
  choice_text: string; // Text of the choice
  question_id: number; // FK to Question
}
//------------------------------------------------------------------------------

//--------------------------- Answer -------------------------------------------

export interface Answer {
  answer_id: number;
  join_id: number; // FK to ActivityDetail
  questioon_id: number; // FK to Question
  choice_id: number; // FK to Choice
  answer_text: string; // Textual answer
  set_number_id: number; // FK to SetNumber
  assessment_id: number; // FK to Assessment
}
//------------------------------------------------------------------------------

//--------------------------- Join ---------------------------------------------

export interface join {
  join_id: number;
  students_id: number; // FK to Student
  teacher_id: number; // FK to Teacher
  join_date: string; // ISO format (e.g., 2024-06-17T12:00:00Z)
  status: "Pending" | "Cmpleted" | "Cancelled";
  activity_detail_id: number; // FK to ActivityDetail
}
//------------------------------------------------------------------------------

//--------------------------- Student ------------------------------------------

export interface Student {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  risk_status: "Normal" | "Risk";
  education_status: "Studying" | "Graduate";
}
//------------------------------------------------------------------------------

//---------------------------Teacher -------------------------------------------

export interface Teacher {
  teacher_id: number;
  first_name: string;
  last_name: string;
  faculty_id: number; // FK to Faculty
}
//------------------------------------------------------------------------------

//--------------------------- Faculty ------------------------------------------

export interface Faculty {
  faculty_id: number;
  faculty_name: string;
}
//------------------------------------------------------------------------------

//--------------------------- Department ---------------------------------------

export interface Department {
  department_id: number;
  department_name: string;
  faculty_id: number; // FK to Faculty
}
//------------------------------------------------------------------------------

//--------------------------- EventCoop ----------------------------------------

export interface EventCoop {
  eventcoop_id: number;
  department_id: number; // FK to Department
  grade_id: number; // FK to Grade
  date: string; // ISO format (e.g., 2024-06-17T12:00:00Z)
}
//------------------------------------------------------------------------------

//--------------------------- Grade --------------------------------------------

export interface Grade {
  grade_id: number;
  level: "1" | "2" | "3" | "4"; // Level of the grade
}
//------------------------------------------------------------------------------

//--------------------------- User ---------------------------------------------

export interface Users {
  user_id: number;
  username: string;
  password: string;
  roles_id: number; // FK to Roles
}
//------------------------------------------------------------------------------

//--------------------------- Roles --------------------------------------------

export interface Roles {
  roles_id: number;
  role_name: "Student" | "Teacher" | "Admin"; // Name of the role (e.g., 'Admin', 'User')
}
//------------------------------------------------------------------------------

//--------------------------- AuthUser -----------------------------------------

export interface AuthUser {
  userId: number;
  username: string;
  role: "Student" | "Teacher" | "Admin";
  role_id: number;
  token: string;
}

//------------------------------------------------------------------------------

//--------------------------- Certificate --------------------------------------

export interface Certicate {
  certificate_id: number;
  student_id: number; // FK to Student
  teacher_id: number; // FK to Teacher
  activity_id: number; // FK to Activity
  date: string; // ISO format (e.g., 2024-06-17T12:00:00Z)
  hours: number; // Number of hours for the certificate
  imge: string; // URL of the certificate image
  status: "Issued" | "Revoked"; // Status of the certificate
}
//------------------------------------------------------------------------------
