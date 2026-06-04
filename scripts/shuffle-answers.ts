/**
 * shuffle-answers.ts
 *
 * Reads generated-questions.ts, shuffles the answer options for each question
 * so the correct answer is evenly distributed across A/B/C/D, then rewrites
 * the file in place.
 *
 * Usage:  npx tsx scripts/shuffle-answers.ts
 */

import * as fs from "fs";
import * as path from "path";

const FILE = path.resolve(
  __dirname,
  "../lib/db/generated-questions.ts"
);

// Seeded PRNG for reproducibility (simple mulberry32)
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);

// Fisher-Yates shuffle with our PRNG
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const letters = ["A", "B", "C", "D"] as const;
type Letter = (typeof letters)[number];

// Read file
const src = fs.readFileSync(FILE, "utf-8");

// We'll process line by line. Each question is a single-line object literal.
// Strategy: find lines containing `correct: "X"` and shuffle the options.

const lines = src.split("\n");
let counts: Record<Letter, number> = { A: 0, B: 0, C: 0, D: 0 };
let total = 0;

// We'll assign target slots round-robin to get even distribution
// First pass: collect all question line indices
const questionIndices: number[] = [];
for (let i = 0; i < lines.length; i++) {
  if (/correct:\s*"[A-D]"/.test(lines[i])) {
    questionIndices.push(i);
  }
}

// Create a shuffled assignment of target correct positions
// e.g., for 625 questions: 156 A, 157 B, 156 C, 156 D
const targetPositions: number[] = [];
for (let i = 0; i < questionIndices.length; i++) {
  targetPositions.push(i % 4); // 0=A, 1=B, 2=C, 3=D
}
// Shuffle this array so assignment is random, not sequential
const shuffledTargets = shuffle(targetPositions);

// Second pass: for each question, rearrange options so correct goes to target slot
for (let qi = 0; qi < questionIndices.length; qi++) {
  const lineIdx = questionIndices[qi];
  const line = lines[lineIdx];

  // Extract current options and correct answer
  const optAMatch = line.match(/option_a:\s*"((?:[^"\\]|\\.)*)"/);
  const optBMatch = line.match(/option_b:\s*"((?:[^"\\]|\\.)*)"/);
  const optCMatch = line.match(/option_c:\s*"((?:[^"\\]|\\.)*)"/);
  const optDMatch = line.match(/option_d:\s*"((?:[^"\\]|\\.)*)"/);
  const correctMatch = line.match(/correct:\s*"([A-D])"/);

  if (!optAMatch || !optBMatch || !optCMatch || !optDMatch || !correctMatch) {
    console.warn(`Skipping line ${lineIdx + 1}: could not parse options`);
    continue;
  }

  const options: Record<Letter, string> = {
    A: optAMatch[1],
    B: optBMatch[1],
    C: optCMatch[1],
    D: optDMatch[1],
  };
  const currentCorrect = correctMatch[1] as Letter;
  const correctText = options[currentCorrect];

  // Build new order: we want correctText at targetSlot, others fill remaining slots
  const targetSlot = shuffledTargets[qi]; // 0-3
  const targetLetter = letters[targetSlot];

  // Get the wrong answers (preserving relative order but shuffled)
  const wrongTexts = letters
    .filter((l) => l !== currentCorrect)
    .map((l) => options[l]);
  const shuffledWrongs = shuffle(wrongTexts);

  // Assign: target slot gets correct, rest get wrongs
  const newOptions: Record<Letter, string> = { A: "", B: "", C: "", D: "" };
  let wrongIdx = 0;
  for (const l of letters) {
    if (l === targetLetter) {
      newOptions[l] = correctText;
    } else {
      newOptions[l] = shuffledWrongs[wrongIdx++];
    }
  }

  // Rebuild the line with new options and correct letter
  let newLine = line;
  newLine = newLine.replace(
    /option_a:\s*"(?:[^"\\]|\\.)*"/,
    `option_a: "${newOptions.A}"`
  );
  newLine = newLine.replace(
    /option_b:\s*"(?:[^"\\]|\\.)*"/,
    `option_b: "${newOptions.B}"`
  );
  newLine = newLine.replace(
    /option_c:\s*"(?:[^"\\]|\\.)*"/,
    `option_c: "${newOptions.C}"`
  );
  newLine = newLine.replace(
    /option_d:\s*"(?:[^"\\]|\\.)*"/,
    `option_d: "${newOptions.D}"`
  );
  newLine = newLine.replace(
    /correct:\s*"[A-D]"/,
    `correct: "${targetLetter}"`
  );

  lines[lineIdx] = newLine;
  counts[targetLetter]++;
  total++;
}

// Write back
fs.writeFileSync(FILE, lines.join("\n"), "utf-8");

console.log(`\n✅ Shuffled ${total} questions.`);
console.log(`   New distribution:`);
for (const l of letters) {
  console.log(
    `     ${l}: ${counts[l]}  (${((counts[l] / total) * 100).toFixed(1)}%)`
  );
}
