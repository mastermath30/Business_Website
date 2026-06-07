import type { Activity, Question, Topic, UserStats } from "./types";

export const topics: Topic[] = [
  {
    id: "t1",
    title: "Marketing Strategy",
    slug: "marketing-strategy",
    emoji: "📈",
    description: "Segmentation, targeting, positioning, and the 4 Ps.",
    course: "MKT 301",
    questionCount: 0,
    masteredCount: 0,
    estimatedMinutes: 18,
    color: "purple",
    updatedAt: "2026-05-04",
  },
  {
    id: "t2",
    title: "Financial Accounting",
    slug: "financial-accounting",
    emoji: "🧾",
    description: "Balance sheets, income statements, and cash flow analysis.",
    course: "ACC 210",
    questionCount: 0,
    masteredCount: 0,
    estimatedMinutes: 22,
    color: "blue",
    updatedAt: "2026-05-06",
  },
  {
    id: "t3",
    title: "Operations Management",
    slug: "operations-management",
    emoji: "⚙️",
    description: "Lean, Six Sigma, capacity planning, and supply chains.",
    course: "OPS 320",
    questionCount: 0,
    masteredCount: 0,
    estimatedMinutes: 14,
    color: "cyan",
    updatedAt: "2026-05-02",
  },
  {
    id: "t4",
    title: "Organizational Behavior",
    slug: "organizational-behavior",
    emoji: "🧠",
    description: "Motivation theories, group dynamics, leadership styles.",
    course: "MGT 250",
    questionCount: 0,
    masteredCount: 0,
    estimatedMinutes: 16,
    color: "pink",
    updatedAt: "2026-05-05",
  },
  {
    id: "t5",
    title: "Microeconomics",
    slug: "microeconomics",
    emoji: "📊",
    description: "Supply, demand, elasticity, and market structures.",
    course: "ECO 102",
    questionCount: 0,
    masteredCount: 0,
    estimatedMinutes: 26,
    color: "amber",
    updatedAt: "2026-05-01",
  },
  {
    id: "t6",
    title: "Business Statistics",
    slug: "business-statistics",
    emoji: "🎲",
    description: "Probability, hypothesis testing, regression analysis.",
    course: "STA 215",
    questionCount: 0,
    masteredCount: 0,
    estimatedMinutes: 20,
    color: "emerald",
    updatedAt: "2026-05-03",
  },
];

export const questions: Question[] = [];

export const activities: Activity[] = [
  {
    id: "a1",
    type: "quiz_completed",
    title: "Completed Marketing Strategy quiz",
    meta: "10/12 correct",
    xp: 120,
    at: new Date(Date.now() - 1000 * 60 * 8),
  },
  {
    id: "a2",
    type: "streak",
    title: "12-day streak unlocked",
    meta: "Personal best",
    xp: 50,
    at: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: "a3",
    type: "topic_uploaded",
    title: "Uploaded Lecture-9-OB.pptx",
    meta: "31 questions generated",
    at: new Date(Date.now() - 1000 * 60 * 60 * 9),
  },
  {
    id: "a4",
    type: "mastered",
    title: "Mastered Operations Management",
    meta: "22/28 questions",
    xp: 200,
    at: new Date(Date.now() - 1000 * 60 * 60 * 28),
  },
  {
    id: "a5",
    type: "level_up",
    title: "Level 14 reached",
    xp: 100,
    at: new Date(Date.now() - 1000 * 60 * 60 * 50),
  },
];

export const userStats: UserStats = {
  xp: 4820,
  level: 14,
  streak: 12,
  longestStreak: 23,
  weeklyMinutes: 184,
  accuracy: 87,
};

// Generate a 13×7 heatmap of activity intensities (0-4)
export function generateHeatmap(): number[][] {
  const grid: number[][] = [];
  let seed = 7;
  for (let week = 0; week < 13; week++) {
    const row: number[] = [];
    for (let day = 0; day < 7; day++) {
      seed = (seed * 9301 + 49297) % 233280;
      const r = seed / 233280;
      // weighted toward lower values, with occasional bursts
      let v = 0;
      if (r > 0.35) v = 1;
      if (r > 0.6) v = 2;
      if (r > 0.82) v = 3;
      if (r > 0.94) v = 4;
      row.push(v);
    }
    grid.push(row);
  }
  return grid;
}

export const weeklyMinutesSeries = [22, 38, 41, 18, 52, 33, 28];
