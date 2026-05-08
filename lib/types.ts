export type Difficulty = "easy" | "medium" | "hard";

export interface Topic {
  id: string;
  title: string;
  slug: string;
  emoji: string;
  description: string;
  course: string;
  questionCount: number;
  masteredCount: number;
  estimatedMinutes: number;
  color: "blue" | "purple" | "cyan" | "pink" | "amber" | "emerald";
  updatedAt: string;
}

export interface Question {
  id: string;
  topicId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
  source?: string;
}

export interface Activity {
  id: string;
  type: "quiz_completed" | "topic_uploaded" | "streak" | "mastered" | "level_up";
  title: string;
  meta?: string;
  xp?: number;
  at: Date;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  weeklyMinutes: number;
  accuracy: number;
}
