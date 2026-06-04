// In-memory seed acting as the project's "database". Swap `lib/db/index.ts`
// with a real Postgres/Supabase client and these tables map 1:1.
//
// QUESTIONS: all 25 lessons have hand-written MCQs grounded in the actual
// lecture slides under /sem1 and /sem2 (see `generated-questions.ts`).

import type {
  AnswerLetter,
  DbQuestion,
  Powerpoint,
  Semester,
} from "./schema";
import { GENERATED_BANK } from "./generated-questions";
import { balanceQuizOptions } from "@/lib/utils";

// ─── powerpoints ────────────────────────────────────────────────────────────
// Filenames mirror the actual decks living under /sem1 and /sem2.
const sem1Files = [
  "Lesson 1_Introduction-1.pptx",
  "Lesson 2_Bus definition_formations_cbn-1.pptx",
  "Lesson 3_SWOT Analysis_Factors of Prod_Precepts-1.pptx",
  "Lesson 4_Questioning_Paired interviewing-1 (4).pptx",
  "Lesson 5_Interviewing-1.pptx",
  "Lesson 7_types of markets_competition-1.pptx",
  "Lesson 8 Macroecon and stock-1.pptx",
  "Lesson 9_Giving and Receiving Feedback_Nov precept-1.pptx",
  "Lesson 10_Groups_Abilene_Dec pre-1.pptx",
  "Lesson 11_Marketing-1.pptx",
  "Lesson 12_Pricing Exercise-1.pptx",
  "Lesson 13_pricing in depth-1.pptx",
  "Lesson 14 micro econ-1.pptx",
];

const sem2Files = [
  "Lesson 16_Intro to Econ_Supply and Demand.pptx",
  "Lesson 17_Business Model Canvas.pptx",
  "Lesson 18 Shark Tank_Demographics_Market Segmentation.ppt",
  "Lesson 19 Brand Ambassadors, Colors, Influencers, Product Placement.pptx",
  "Lesson 20 Kudos_Game Theory.pptx",
  "Lesson 21_Intellectual Property lesson.pptx",
  "Lesson_Economic Floors and Ceilings.pptx",
  "Lesson_Econ_Production Possibilities Curve.pptx",
  "Lesson_Fiscal Policy_Fed reserve.pptx",
  "Lesson_Supply and Demand.pptx",
  "Workplace Etiquette_Lesson.pptx",
  "Tesla Stem 2026.pptx",
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleizeFromFilename(filename: string): string {
  let s = filename.replace(/\.(pptx?|key)$/i, "");
  s = s.replace(/-\d+(\s*\(\d+\))?$/g, "");
  s = s.replace(/^Lesson\s*\d*\s*[_-]?\s*/i, "");
  s = s.replace(/^Lesson_/i, "");
  s = s.replace(/[_,]/g, " ").replace(/\s+/g, " ").trim();
  const small = new Set(["and", "of", "in", "the", "for", "to", "a"]);
  return s
    .split(" ")
    .map((w, i) =>
      i > 0 && small.has(w.toLowerCase())
        ? w.toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(" ")
    .trim();
}

function buildPowerpoint(
  filename: string,
  semester: Semester,
  index: number
): Powerpoint {
  const topic_name = titleizeFromFilename(filename) || `Lesson ${index + 1}`;
  const id = `s${semester}-${slugify(topic_name) || `lesson-${index + 1}`}`;
  const file_path = `/sem${semester}/${filename}`;
  return { id, semester, topic_name, file_path };
}

export const powerpoints: Powerpoint[] = [
  ...sem1Files.map((f, i) => buildPowerpoint(f, 1, i)),
  ...sem2Files.map((f, i) => buildPowerpoint(f, 2, i)),
];

// ─── question templates ─────────────────────────────────────────────────────
// 50 placeholder MCQs per topic, mixing question shapes (definitions,
// applications, contrasts, FALSE-finds, recommendations, etc.).
// TODO(BB): replace the `questions` export with a real per-topic bank
// generated from each .pptx via an LLM extractor.

interface Template {
  q: (topic: string) => string;
  options: [string, string, string, string];
  correct: AnswerLetter;
  explanation: (topic: string) => string;
}

const TEMPLATES: Template[] = [
  // ── Definition / identification (1–6) ────────────────────────────────────
  {
    q: (t) => `Which statement best captures the core idea of "${t}"?`,
    options: [
      "It is unrelated to the broader unit's themes",
      "It introduces a foundational concept reused later in the course",
      "It is a tangential historical anecdote",
      "It only matters in advanced electives",
    ],
    correct: "B",
    explanation: (t) =>
      `${t} is a foundational lecture; later units build directly on the framework introduced here.`,
  },
  {
    q: (t) => `${t} is most closely related to which broader theme?`,
    options: [
      "Quantum physics",
      "Strategic and economic decision-making",
      "Constitutional law",
      "Environmental engineering",
    ],
    correct: "B",
    explanation: () =>
      "This unit lives within the strategic / economic decision-making track of the course.",
  },
  {
    q: (t) => `The single best one-sentence summary of ${t} is:`,
    options: [
      "A purely historical curiosity with no modern use",
      "A framework for structuring decisions under tradeoffs",
      "An accounting standard mandated by GAAP",
      "A type of marketing slogan",
    ],
    correct: "B",
    explanation: () =>
      "Frameworks like this exist to help you structure decisions when no option is obviously dominant.",
  },
  {
    q: (t) => `Which audience benefits most from understanding ${t}?`,
    options: [
      "Only academic researchers",
      "Anyone making business or strategic decisions",
      "Strictly accountants in audit roles",
      "People preparing legal contracts",
    ],
    correct: "B",
    explanation: () =>
      "The framework generalizes to any decision-maker weighing tradeoffs, not just specialists.",
  },
  {
    q: (t) => `${t} is best described as:`,
    options: [
      "A piece of software",
      "A repeatable mental model for analysis",
      "A regulatory body",
      "A type of contract",
    ],
    correct: "B",
    explanation: () =>
      "It's a repeatable mental model — you reuse the same structure across different decisions.",
  },
  {
    q: (t) => `Which word best characterizes mastery of ${t}?`,
    options: ["Memorization", "Fluency", "Speed", "Volume"],
    correct: "B",
    explanation: () =>
      "Fluency — applying the framework smoothly under new conditions — beats memorization every time.",
  },

  // ── First-step / approach (7–11) ─────────────────────────────────────────
  {
    q: (t) =>
      `A practitioner applying ${t} to a real business decision should first:`,
    options: [
      "Make a recommendation",
      "Estimate cost",
      "Define the decision and the relevant constraints",
      "Survey customers",
    ],
    correct: "C",
    explanation: () =>
      "Defining the decision and its constraints frames every downstream step.",
  },
  {
    q: (t) => `Before applying ${t}, the most important prerequisite is:`,
    options: [
      "A finished spreadsheet",
      "A clearly stated objective",
      "Approval from senior leadership",
      "A press release draft",
    ],
    correct: "B",
    explanation: () =>
      "A clearly stated objective is the anchor every analytical step compares back to.",
  },
  {
    q: (t) => `When using ${t}, the second move after framing the problem is:`,
    options: [
      "Skip ahead to the answer",
      "Identify the inputs and assumptions the framework requires",
      "Email the answer to the team",
      "Hire a consultant",
    ],
    correct: "B",
    explanation: () =>
      "Identifying inputs and assumptions surfaces the levers and the fragile spots simultaneously.",
  },
  {
    q: (t) => `In ${t}, the right way to handle ambiguous data is to:`,
    options: [
      "Ignore it and pick a number that 'feels right'",
      "State the assumption explicitly and run sensitivity",
      "Average everything",
      "Wait for perfect data",
    ],
    correct: "B",
    explanation: () =>
      "Explicit assumptions plus sensitivity analysis keep ambiguous inputs honest.",
  },
  {
    q: (t) => `In ${t}, when constraints conflict, the right response is to:`,
    options: [
      "Pick whichever constraint is loudest",
      "Surface the tradeoff and decide explicitly",
      "Drop the analysis",
      "Combine constraints into one number",
    ],
    correct: "B",
    explanation: () =>
      "Surfacing the tradeoff makes the decision visible — that's the framework's job.",
  },

  // ── Application scenarios (12–19) ────────────────────────────────────────
  {
    q: (t) => `Which scenario best illustrates ${t} in action?`,
    options: [
      "A purely random outcome with no structure",
      "A decision under tradeoffs that the framework helps resolve",
      "A situation where the framework cannot apply",
      "A historical event before the framework existed",
    ],
    correct: "B",
    explanation: () =>
      "The framework's value shows up exactly when there are real tradeoffs.",
  },
  {
    q: (t) => `A startup founder applies ${t} to:`,
    options: [
      "Choose a logo color",
      "Frame a strategic choice with several plausible options",
      "Set up payroll",
      "Negotiate a lease",
    ],
    correct: "B",
    explanation: () =>
      "Founders use frameworks like this to compare strategic options on consistent terms.",
  },
  {
    q: (t) => `On a case interview, ${t} would be used to:`,
    options: [
      "Stall while you think",
      "Structure the analysis and identify the right next question",
      "Show off jargon",
      "Avoid quantitative work",
    ],
    correct: "B",
    explanation: () =>
      "Frameworks structure the analysis and surface the next high-leverage question.",
  },
  {
    q: (t) => `A product manager would apply ${t} when:`,
    options: [
      "Choosing meeting times",
      "Prioritizing features against shipping constraints",
      "Filing expense reports",
      "Writing a status update",
    ],
    correct: "B",
    explanation: () =>
      "Feature prioritization under shipping constraints is exactly where this framework earns its keep.",
  },
  {
    q: (t) => `${t} is most useful in a context where:`,
    options: [
      "Every option is equally good",
      "Multiple options exist with non-obvious tradeoffs",
      "Only one option is legal",
      "Time is unlimited and cost is zero",
    ],
    correct: "B",
    explanation: () =>
      "Frameworks are built for the messy middle: many options, non-obvious tradeoffs.",
  },
  {
    q: (t) => `In a board presentation about ${t}, the strongest section is:`,
    options: [
      "A long bibliography",
      "A clear recommendation tied to the framework's logic",
      "A timeline of the company's history",
      "A list of competitor logos",
    ],
    correct: "B",
    explanation: () =>
      "Boards reward a clear recommendation grounded in the framework's logic.",
  },
  {
    q: (t) => `If two analysts apply ${t} to the same problem:`,
    options: [
      "They must arrive at identical numbers",
      "They may differ in inputs/assumptions but should agree on the structure",
      "They will always disagree",
      "Their answers cannot be compared",
    ],
    correct: "B",
    explanation: () =>
      "Inputs and judgment may differ, but the structure should be recognizable across analysts.",
  },
  {
    q: (t) => `A team running ${t} for the first time should expect:`,
    options: [
      "Instant perfect output",
      "A rough first pass that improves with iteration",
      "A finished plan with no revisions",
      "An error-free spreadsheet",
    ],
    correct: "B",
    explanation: () =>
      "First passes are rough — iteration is the norm, not a sign of failure.",
  },

  // ── FALSE / EXCEPT (20–24) ───────────────────────────────────────────────
  {
    q: (t) => `Which of the following is FALSE about ${t}?`,
    options: [
      "It can be applied across industries",
      "It always produces a single, objectively correct answer",
      "It improves with structured practice",
      "It is best understood through cases",
    ],
    correct: "B",
    explanation: () =>
      "Real-world applications rarely yield a single objectively correct answer — they produce defensible recommendations under tradeoffs.",
  },
  {
    q: (t) => `All of the following describe ${t} EXCEPT:`,
    options: [
      "It is a structured way to think",
      "It is intended to replace judgment entirely",
      "It surfaces tradeoffs",
      "It scales across decisions",
    ],
    correct: "B",
    explanation: () =>
      "The framework supports judgment; it does not replace it.",
  },
  {
    q: (t) => `Which is NOT a strength of ${t}?`,
    options: [
      "Repeatable structure",
      "Comparability across cases",
      "Eliminating the need for data",
      "Surfacing fragile assumptions",
    ],
    correct: "C",
    explanation: () =>
      "Frameworks need data to land — they don't eliminate the need for evidence.",
  },
  {
    q: (t) => `Which statement about ${t} is FALSE?`,
    options: [
      "Practice improves your fluency",
      "It works only when memorized verbatim",
      "It generalizes across industries",
      "It surfaces tradeoffs",
    ],
    correct: "B",
    explanation: () =>
      "Verbatim memorization is brittle; fluency comes from applying the structure flexibly.",
  },
  {
    q: (t) => `Which is NOT a typical use case for ${t}?`,
    options: [
      "Strategic option comparison",
      "Resource allocation",
      "Customer-segment analysis",
      "Setting employee birthdays",
    ],
    correct: "D",
    explanation: () =>
      "Trivial scheduling tasks aren't the framework's job — strategic comparisons are.",
  },

  // ── Tradeoff identification (25–29) ──────────────────────────────────────
  {
    q: (t) => `The defining feature of decisions where ${t} applies is:`,
    options: [
      "There is no tradeoff",
      "Tradeoffs exist between two or more credible options",
      "All options are illegal",
      "The decision is purely personal",
    ],
    correct: "B",
    explanation: () =>
      "Without tradeoffs there's no decision to structure — that's the framework's whole purpose.",
  },
  {
    q: (t) =>
      `When applying ${t}, ignoring the tradeoffs typically leads to:`,
    options: [
      "Better decisions",
      "Recommendations that fall apart under scrutiny",
      "Faster execution",
      "Higher revenue",
    ],
    correct: "B",
    explanation: () =>
      "Recommendations that hide tradeoffs collapse the moment they meet a skeptical audience.",
  },
  {
    q: (t) => `${t} forces analysts to be honest about:`,
    options: [
      "Their salary expectations",
      "What is being given up to gain something else",
      "Their favorite color",
      "Office logistics",
    ],
    correct: "B",
    explanation: () =>
      "Naming what's given up — the opportunity cost — is core to the framework.",
  },
  {
    q: (t) =>
      `Two students disagree on a ${t} application. The right move is to:`,
    options: [
      "Vote and move on",
      "Defer to the louder student",
      "Re-anchor on the framework's assumptions and check which apply",
      "Ask the professor to settle it",
    ],
    correct: "C",
    explanation: () =>
      "Disagreements usually trace back to different assumptions — re-anchoring resolves most cases.",
  },
  {
    q: (t) => `In ${t}, the most important tradeoff to surface is usually:`,
    options: [
      "Office layout",
      "The one the recommendation hides",
      "Color of the slide deck",
      "The boss's favorite option",
    ],
    correct: "B",
    explanation: () =>
      "The tradeoff your recommendation quietly hides is the one that will sink it later.",
  },

  // ── Limitations / critiques (30–34) ──────────────────────────────────────
  {
    q: (t) => `Which limitation should you flag when presenting ${t}?`,
    options: [
      "There are no limitations worth mentioning",
      "Sensitivity to inputs and the assumptions baked in",
      "It only works on Mondays",
      "It is illegal in some jurisdictions",
    ],
    correct: "B",
    explanation: () =>
      "Every framework is sensitive to its inputs and assumptions — naming those is part of a strong analysis.",
  },
  {
    q: (t) => `${t} can mislead an analyst when:`,
    options: [
      "It is applied with explicit assumptions",
      "Inputs are stale or unrepresentative",
      "Tradeoffs are surfaced",
      "The team iterates on the model",
    ],
    correct: "B",
    explanation: () =>
      "Stale or unrepresentative inputs are the silent killer — the framework can't fix bad data.",
  },
  {
    q: (t) => `A common critique of ${t} is that:`,
    options: [
      "It is too simple to be useful",
      "It can create false precision when inputs are uncertain",
      "It removes all subjectivity",
      "It always recommends the cheapest option",
    ],
    correct: "B",
    explanation: () =>
      "Frameworks can dress soft estimates in hard numbers — guard against that with sensitivity analysis.",
  },
  {
    q: (t) => `${t} should be paired with:`,
    options: [
      "A single point estimate only",
      "Sensitivity analysis around the key assumptions",
      "Press release templates",
      "A board minutes document",
    ],
    correct: "B",
    explanation: () =>
      "Sensitivity analysis is the natural complement — it shows which assumptions actually move the answer.",
  },
  {
    q: (t) => `Over-relying on ${t} can lead to:`,
    options: [
      "Better decisions across the board",
      "Treating the model as the territory and missing real-world signals",
      "Smaller teams",
      "Higher net promoter score",
    ],
    correct: "B",
    explanation: () =>
      "The map is not the territory — pair the framework with feedback from the real world.",
  },

  // ── Best practice / recommendations (35–42) ──────────────────────────────
  {
    q: (t) => `An effective study strategy for ${t} is:`,
    options: [
      "Re-reading the slides passively",
      "Active recall + applying the framework to a fresh case",
      "Memorizing every slide verbatim",
      "Highlighting in three colors",
    ],
    correct: "B",
    explanation: () =>
      "Active recall paired with case application produces the strongest retention.",
  },
  {
    q: (t) => `When teaching peers about ${t}, you should emphasize:`,
    options: [
      "Memorizing the diagram exactly",
      "The 'why' behind each step, not just the steps",
      "Speed over comprehension",
      "Personal opinions only",
    ],
    correct: "B",
    explanation: () =>
      "Long-term retention depends on understanding *why* each step exists.",
  },
  {
    q: (t) => `In an exam, the highest-scoring response on ${t} usually:`,
    options: [
      "Is the longest",
      "Picks one position and ignores tradeoffs",
      "States the framework, applies it, and explicitly weighs tradeoffs",
      "Restates the question and stops",
    ],
    correct: "C",
    explanation: () =>
      "State → apply → weigh tradeoffs is the structure that consistently lands top marks.",
  },
  {
    q: (t) =>
      `When evaluating a peer's answer on ${t}, the highest-leverage question is:`,
    options: [
      "What is your conclusion?",
      "Which assumptions are you making, and which are most fragile?",
      "How long did this take you?",
      "Did you use the textbook?",
    ],
    correct: "B",
    explanation: () =>
      "Surfacing fragile assumptions exposes weak links faster than any other critique question.",
  },
  {
    q: (t) =>
      `The best way to write a recommendation grounded in ${t} is to:`,
    options: [
      "Lead with hedging language",
      "State the recommendation, then the reasoning, then the risks",
      "Bury the recommendation at the end",
      "List every piece of data without conclusion",
    ],
    correct: "B",
    explanation: () =>
      "Lead with the answer, support it with reasoning, then name the risks — the readable order.",
  },
  {
    q: (t) =>
      `The single highest-ROI behavior when learning ${t} is:`,
    options: [
      "Re-watching the lecture three times",
      "Trying to apply it to a real example you care about",
      "Memorizing every word from the slides",
      "Summarizing it in your own handwriting only",
    ],
    correct: "B",
    explanation: () =>
      "Application against something you care about creates the deepest memory traces.",
  },
  {
    q: (t) => `When presenting ${t} to a non-expert audience, you should:`,
    options: [
      "Use as much jargon as possible",
      "Strip the jargon and lead with the underlying logic",
      "Skip the framework",
      "Read directly from the slides",
    ],
    correct: "B",
    explanation: () =>
      "Strip jargon, lead with logic — the framework should illuminate, not gatekeep.",
  },
  {
    q: (t) =>
      `If you have only five minutes to teach someone ${t}, lead with:`,
    options: [
      "The textbook definition",
      "A single concrete example that shows the framework working",
      "A list of every alternative framework",
      "The history of the framework's authors",
    ],
    correct: "B",
    explanation: () =>
      "A concrete example beats abstract definitions for compressed teaching windows.",
  },

  // ── Compare / contrast / category (43–47) ────────────────────────────────
  {
    q: (t) =>
      `${t} differs from a checklist in that:`,
    options: [
      "It has no steps",
      "It requires judgment and adaptation, not just compliance",
      "It must be done in alphabetical order",
      "It is always shorter",
    ],
    correct: "B",
    explanation: () =>
      "Checklists enforce compliance; frameworks invite adapted judgment.",
  },
  {
    q: (t) => `Compared to ad-hoc reasoning, ${t} provides:`,
    options: [
      "More chaos",
      "A repeatable structure that exposes assumptions",
      "Slower decisions in every case",
      "A guarantee of correctness",
    ],
    correct: "B",
    explanation: () =>
      "Repeatable structure + visible assumptions are the framework's edge over winging it.",
  },
  {
    q: (t) => `${t} belongs to the broader category of:`,
    options: [
      "Decision frameworks for analysis under uncertainty",
      "Office productivity software",
      "Branding guidelines",
      "Financial reporting standards",
    ],
    correct: "A",
    explanation: () =>
      "It sits inside the broader category of decision frameworks for uncertain conditions.",
  },
  {
    q: (t) => `${t} is most similar in spirit to:`,
    options: [
      "A recipe that must be followed exactly",
      "A diagnostic tool that adapts to the case",
      "A legal contract",
      "A random number generator",
    ],
    correct: "B",
    explanation: () =>
      "Closer to a diagnostic tool than a recipe — it adapts to what's in front of you.",
  },
  {
    q: (t) => `Which best contrasts ${t} with intuition alone?`,
    options: [
      "It removes the need for any judgment",
      "It documents the reasoning so others can check and improve it",
      "It is always slower than intuition",
      "It is never wrong",
    ],
    correct: "B",
    explanation: () =>
      "Documented reasoning is the gift — others (and future-you) can check and refine it.",
  },

  // ── Common mistakes (48–50) ──────────────────────────────────────────────
  {
    q: (t) => `In the context of ${t}, the most common analytical mistake is:`,
    options: [
      "Skipping the framework and jumping to an answer",
      "Using more data than necessary",
      "Always picking the median option",
      "Following the textbook's exact wording",
    ],
    correct: "A",
    explanation: () =>
      "Skipping structure and jumping to an answer is the canonical failure mode.",
  },
  {
    q: (t) => `A frequent mistake when applying ${t} for the first time is:`,
    options: [
      "Stating assumptions explicitly",
      "Confusing the framework's labels with the underlying logic",
      "Iterating the analysis",
      "Asking clarifying questions",
    ],
    correct: "B",
    explanation: () =>
      "First-timers often parrot the labels without grasping the logic underneath.",
  },
  {
    q: (t) => `The wrong way to use ${t} is to:`,
    options: [
      "Use it as a structured prompt for thinking",
      "Use it as a substitute for engaging with the actual problem",
      "Use it across multiple cases",
      "Pair it with sensitivity analysis",
    ],
    correct: "B",
    explanation: () =>
      "When the framework becomes a shield against engaging with the real problem, it has failed.",
  },
];

if (TEMPLATES.length !== 50) {
  // Hard signal during development — keeps the bank size accurate.
  console.warn(
    `[seed.ts] Expected 50 templates, found ${TEMPLATES.length}. Update the bank.`
  );
}

// Builds the question bank for a powerpoint. Prefers hand-written
// content from `GENERATED_BANK` when present; falls back to templates
// for any lesson that hasn't been seeded yet.
function buildQuestionsForPowerpoint(pp: Powerpoint): DbQuestion[] {
  const real = GENERATED_BANK[pp.id];
  if (real && real.length > 0) {
    return real.map((q, idx) => {
      const [option_a, option_b, option_c, option_d] = balanceQuizOptions([
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
      ]);
      return {
        id: `${pp.id}-q${idx + 1}`,
        powerpoint_id: pp.id,
        question: q.question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer: q.correct,
        explanation: q.explanation,
      };
    });
  }
  // Fallback for lessons without real questions yet.
  return TEMPLATES.map((t, idx) => {
    const [option_a, option_b, option_c, option_d] = balanceQuizOptions([
      t.options[0],
      t.options[1],
      t.options[2],
      t.options[3],
    ]);
    return {
      id: `${pp.id}-q${idx + 1}`,
      powerpoint_id: pp.id,
      question: t.q(pp.topic_name),
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer: t.correct,
      explanation: t.explanation(pp.topic_name),
    };
  });
}

export const questions: DbQuestion[] = powerpoints.flatMap(
  buildQuestionsForPowerpoint
);

// ─── tiny query helpers (swap for real DB later) ────────────────────────────

export function getPowerpointsBySemester(semester: Semester): Powerpoint[] {
  return powerpoints.filter((p) => p.semester === semester);
}

export function getPowerpointById(id: string): Powerpoint | undefined {
  return powerpoints.find((p) => p.id === id);
}

// All 50 questions for a topic (full pool).
export function getAllQuestionsForPowerpoint(
  powerpointId: string
): DbQuestion[] {
  return questions.filter((q) => q.powerpoint_id === powerpointId);
}

// Legacy helper — first N questions (kept for callers that don't rotate).
export function getQuestionsForPowerpoint(
  powerpointId: string,
  limit = 10
): DbQuestion[] {
  return getAllQuestionsForPowerpoint(powerpointId).slice(0, limit);
}

// ─── client-side rotation logic ─────────────────────────────────────────────
// Pick `count` questions from the full pool, preferring ones whose IDs are
// NOT in `seenIds`. When the pool of unseen runs dry, reset and pull from
// the full pool. Caller passes a seeded RNG so different sessions yield
// different sets without re-importing a shuffle library.

export function pickRotatedQuestions(
  pool: DbQuestion[],
  seenIds: ReadonlySet<string>,
  count: number,
  rng: () => number = Math.random
): { selected: DbQuestion[]; rotationReset: boolean } {
  if (pool.length <= count) {
    return { selected: shuffleWith(pool, rng), rotationReset: false };
  }
  let candidates = pool.filter((q) => !seenIds.has(q.id));
  let rotationReset = false;
  if (candidates.length < count) {
    candidates = pool;
    rotationReset = true;
  }
  return {
    selected: shuffleWith(candidates, rng).slice(0, count),
    rotationReset,
  };
}

function shuffleWith<T>(arr: T[], rng: () => number): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getExamQuestionsForSemester(
  semester: Semester,
  limit = 50
): DbQuestion[] {
  const pps = getPowerpointsBySemester(semester);
  const pool = pps.flatMap((pp) =>
    questions.filter((q) => q.powerpoint_id === pp.id)
  );
  // Deterministic shuffle so SSR + client agree.
  const shuffled = pool.slice();
  let seed = 1337 + semester;
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, limit);
}
