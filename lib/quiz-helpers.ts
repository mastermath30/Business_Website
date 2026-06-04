import { questions, topics } from "./data";
import type { Question, Topic } from "./types";
import { balanceQuizOptions } from "./utils";

const fallbackTemplates: Omit<Question, "id" | "topicId">[] = [
  {
    prompt: "Which framework groups customers by shared characteristics for targeted strategy?",
    options: [
      "BCG matrix",
      "STP framework",
      "Ansoff matrix",
      "SWOT analysis",
    ],
    correctIndex: 1,
    explanation:
      "STP — Segmentation, Targeting, Positioning — is the framework for grouping customers and tailoring strategy.",
    difficulty: "easy",
    source: "Auto-generated",
  },
  {
    prompt: "A firm with high market growth and high relative share is classified as:",
    options: ["Cash cow", "Star", "Question mark", "Dog"],
    correctIndex: 1,
    explanation:
      "Stars (BCG matrix) have high growth and high share — they require investment but drive future returns.",
    difficulty: "medium",
    source: "Auto-generated",
  },
  {
    prompt:
      "Which of the following describes a SUNK cost in managerial decision-making?",
    options: [
      "A future cost that varies with output",
      "A cost already incurred and unrecoverable",
      "An opportunity cost of capital",
      "A fixed cost that scales with revenue",
    ],
    correctIndex: 1,
    explanation:
      "Sunk costs are already incurred and cannot be recovered — they should not influence forward-looking decisions.",
    difficulty: "easy",
    source: "Auto-generated",
  },
  {
    prompt:
      "Which leadership style emphasizes vision, inspiration, and intellectual stimulation?",
    options: [
      "Transactional",
      "Laissez-faire",
      "Transformational",
      "Authoritarian",
    ],
    correctIndex: 2,
    explanation:
      "Transformational leadership inspires followers via vision, charisma, and intellectual stimulation, leading to higher engagement.",
    difficulty: "medium",
    source: "Auto-generated",
  },
  {
    prompt: "In a perfectly competitive market, firms in the long run earn:",
    options: [
      "Economic profit due to barriers to entry",
      "Normal profit only — economic profit equals zero",
      "Monopoly rents",
      "Negative returns due to oversupply",
    ],
    correctIndex: 1,
    explanation:
      "Free entry and exit drive economic profits to zero in the long run; firms earn normal accounting returns.",
    difficulty: "hard",
    source: "Auto-generated",
  },
  {
    prompt:
      "The just-in-time (JIT) inventory system primarily aims to:",
    options: [
      "Increase safety stock to buffer demand spikes",
      "Minimize holding costs by aligning inventory with production needs",
      "Maximize batch sizes to capture economies of scale",
      "Outsource warehousing to third parties",
    ],
    correctIndex: 1,
    explanation:
      "JIT minimizes holding cost and waste by receiving materials only as production requires them.",
    difficulty: "medium",
    source: "Auto-generated",
  },
];

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function getQuestionsForTopic(topicId: string, count = 8): Question[] {
  const real = questions.filter((q) => q.topicId === topicId);
  const normalize = (list: Question[]) =>
    list.map((q) => ({ ...q, options: balanceQuizOptions(q.options) }));
  if (real.length >= count) return normalize(real.slice(0, count));
  const padded: Question[] = [...real];
  let i = 0;
  while (padded.length < count) {
    const tpl = fallbackTemplates[i % fallbackTemplates.length];
    padded.push({
      id: `${topicId}-gen-${i}`,
      topicId,
      ...tpl,
    });
    i += 1;
  }
  return normalize(padded);
}
