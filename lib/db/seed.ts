// In-memory seed acting as the project's "database". Swap `lib/db/index.ts`
// with a real Postgres/Supabase client and these tables map 1:1.
//
// Questions are currently empty. Lessons remain available so a new bank can be
// added later without changing route structure.

import type {
  DbQuestion,
  Powerpoint,
  Semester,
} from "./schema";
import { GENERATED_BANK } from "./generated-questions";

// ─── powerpoints ────────────────────────────────────────────────────────────
// Filenames mirror the actual decks living under /sem1 and /sem2.
const sem1Files = [
  "Lesson 1_Introduction-1.pptx",
  "Lesson 3_SWOT Analysis_Factors of Prod_Precepts-1.pptx",
  "Lesson 4_Questioning_Paired interviewing-1 (4).pptx",
  "Lesson 5_Interviewing-1.pptx",
  "Lesson 7_types of markets_competition-1.pptx",
  "Lesson 8 Macroecon and stock-1.pptx",
  "Lesson 9_Giving and Receiving Feedback_Nov precept-1.pptx",
  "Lesson 10_Groups_Abilene_Dec pre-1.pptx",
  "Lesson 11_Marketing-1.pptx",
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
  "Negotiation Skills.pptx",
  "Personal Finance Taxes and Paychecks.pptx",
  "Personal Finance Checking and Savings.pptx",
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

function extractLessonNum(filename: string): string {
  const m = filename.match(/^Lesson\s*(\d+)/i);
  return m ? m[1] : "";
}

const TOPIC_NAME_OVERRIDES: Record<string, string> = {
  "s1-introduction": "Lesson 1 & 2: Introduction & Bus Definition Formations CBN",
};

function buildPowerpoint(
  filename: string,
  semester: Semester,
  index: number
): Powerpoint {
  const title = titleizeFromFilename(filename) || `Lesson ${index + 1}`;
  const lessonNum = extractLessonNum(filename);
  const id = `s${semester}-${slugify(title) || `lesson-${index + 1}`}`;
  const topic_name =
    TOPIC_NAME_OVERRIDES[id] ??
    (lessonNum ? `Lesson ${lessonNum}: ${title}` : title);
  const file_path = `/sem${semester}/${filename}`;
  return { id, semester, topic_name, file_path };
}

export const powerpoints: Powerpoint[] = [
  ...sem1Files.map((f, i) => buildPowerpoint(f, 1, i)),
  ...sem2Files.map((f, i) => buildPowerpoint(f, 2, i)),
];

export const questions: DbQuestion[] = Object.entries(GENERATED_BANK).flatMap(
  ([powerpoint_id, qs]) =>
    qs.map((q, i) => ({
      id: `${powerpoint_id}-q${i + 1}`,
      powerpoint_id,
      question: q.question,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct,
      explanation: q.explanation,
    }))
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
