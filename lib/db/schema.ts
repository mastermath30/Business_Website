// Database schema types — mirrors a relational schema you can move to
// Postgres / SQLite / Supabase by swapping `lib/db/index.ts`.
//
// powerpoints
//   id           string  PK
//   semester     1 | 2
//   topic_name   string  (slugified from filename for display)
//   file_path    string  (relative path under project root, e.g. /sem1/X.pptx)
//
// questions
//   id              string  PK
//   powerpoint_id   string  FK → powerpoints.id
//   question        string
//   option_a        string
//   option_b        string
//   option_c        string
//   option_d        string
//   correct_answer  "A" | "B" | "C" | "D"
//   explanation     string

export type Semester = 1 | 2;
export type AnswerLetter = "A" | "B" | "C" | "D";
export type QuizMode = "study" | "exam";

export interface Powerpoint {
  id: string;
  semester: Semester;
  topic_name: string;
  file_path: string;
}

export interface DbQuestion {
  id: string;
  powerpoint_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: AnswerLetter;
  explanation: string;
}
