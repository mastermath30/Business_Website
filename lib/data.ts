import type { Activity, Question, Topic, UserStats } from "./types";

export const topics: Topic[] = [
  {
    id: "t1",
    title: "Marketing Strategy",
    slug: "marketing-strategy",
    emoji: "📈",
    description: "Segmentation, targeting, positioning, and the 4 Ps.",
    course: "MKT 301",
    questionCount: 42,
    masteredCount: 28,
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
    questionCount: 36,
    masteredCount: 12,
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
    questionCount: 28,
    masteredCount: 22,
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
    questionCount: 31,
    masteredCount: 18,
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
    questionCount: 48,
    masteredCount: 9,
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
    questionCount: 39,
    masteredCount: 25,
    estimatedMinutes: 20,
    color: "emerald",
    updatedAt: "2026-05-03",
  },
];

export const questions: Question[] = [
  {
    id: "q1",
    topicId: "t1",
    prompt:
      "A company segmenting customers by income, age, and education is using which type of segmentation?",
    options: [
      "Geographic segmentation",
      "Demographic segmentation",
      "Psychographic segmentation",
      "Behavioral segmentation",
    ],
    correctIndex: 1,
    explanation:
      "Demographic segmentation groups customers by measurable population characteristics like age, income, gender, and education level.",
    difficulty: "easy",
    source: "Slide 14 · Chapter 3",
  },
  {
    id: "q2",
    topicId: "t1",
    prompt:
      "Which of the 4 Ps refers to the activities that communicate product value to customers?",
    options: ["Product", "Price", "Place", "Promotion"],
    correctIndex: 3,
    explanation:
      "Promotion includes advertising, public relations, sales promotions, and personal selling — anything that communicates value.",
    difficulty: "easy",
    source: "Slide 22 · Chapter 4",
  },
  {
    id: "q3",
    topicId: "t1",
    prompt:
      "A penetration pricing strategy is most appropriate when:",
    options: [
      "The product is highly differentiated and demand is inelastic",
      "Competitors are few and brand prestige is critical",
      "The market is price-sensitive and the firm seeks rapid market share",
      "Costs decline slowly and economies of scale are weak",
    ],
    correctIndex: 2,
    explanation:
      "Penetration pricing sets a low initial price to win market share quickly. It works best when demand is elastic and scale economies reduce unit cost.",
    difficulty: "medium",
    source: "Slide 31 · Chapter 5",
  },
  {
    id: "q4",
    topicId: "t1",
    prompt:
      "In Porter's Five Forces, the threat of substitutes is highest when:",
    options: [
      "Switching costs are high and substitutes are inferior",
      "Buyers have low price sensitivity",
      "Substitutes offer better price-performance and switching costs are low",
      "The industry has high entry barriers",
    ],
    correctIndex: 2,
    explanation:
      "Substitutes pressure profits when they offer attractive price-performance trade-offs and customers can switch cheaply.",
    difficulty: "hard",
    source: "Slide 47 · Chapter 7",
  },
  {
    id: "q5",
    topicId: "t1",
    prompt: "The STP framework stands for:",
    options: [
      "Strategy, Tactics, Performance",
      "Segmentation, Targeting, Positioning",
      "Sales, Trade, Promotion",
      "Survey, Test, Plan",
    ],
    correctIndex: 1,
    explanation:
      "STP — Segmentation, Targeting, Positioning — is the core marketing planning framework for matching offerings to customer groups.",
    difficulty: "easy",
    source: "Slide 9 · Chapter 2",
  },
  {
    id: "q6",
    topicId: "t1",
    prompt:
      "A 'Blue Ocean' strategy primarily focuses on:",
    options: [
      "Outcompeting rivals on cost in existing markets",
      "Creating uncontested market space and making competition irrelevant",
      "Acquiring competitors through M&A",
      "Maximizing short-term profits via premium pricing",
    ],
    correctIndex: 1,
    explanation:
      "Blue Ocean Strategy (Kim & Mauborgne) is about value innovation — creating new demand in uncontested space rather than fighting in 'red oceans.'",
    difficulty: "medium",
    source: "Slide 53 · Chapter 8",
  },
];

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
