/**
 * analyze-and-fix-lengths.ts
 *
 * Analyzes the length imbalance in quiz options (correct answer typically way
 * longer than wrong answers), then fixes it by:
 *  1. Truncating overly-long correct answers at natural break points
 *  2. Expanding very short wrong answers with plausible qualifier phrases
 *
 * Usage:  npx tsx scripts/analyze-and-fix-lengths.ts
 */

import * as fs from "fs";
import * as path from "path";

const FILE = path.resolve(__dirname, "../lib/db/generated-questions.ts");

type Letter = "A" | "B" | "C" | "D";
const LETTERS: Letter[] = ["A", "B", "C", "D"];

// ── Break patterns for truncating long correct answers ─────────────────
// Ordered roughly by how cleanly they split a sentence.
const BREAK_PATTERNS = [
  "; ",
  " — ",
  " – ",
  ", which ",
  ", meaning ",
  ", thereby ",
  ", provided that ",
  ", provided ",
  ", allowing ",
  ", so that ",
  ", ensuring ",
  ", rather than ",
  ", whereas ",
  ", because ",
  ", making it ",
  ", making ",
  ", while ",
  ", where ",
  ", not ",
  ", but ",
  ", and ",
];

// Words that should NOT end a truncated answer (would be grammatically broken)
const BAD_ENDINGS = /\s+(a|an|the|to|in|of|for|by|at|on|is|are|was|were|and|or|but|its|their|with|from|as|that|this|than|into|via)$/i;

function extractOption(line: string, letter: string): string | null {
  const key = `option_${letter.toLowerCase()}`;
  const re = new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
  const m = line.match(re);
  return m ? m[1] : null;
}

function replaceOption(
  line: string,
  letter: string,
  newValue: string
): string {
  const key = `option_${letter.toLowerCase()}`;
  return line.replace(
    new RegExp(`${key}:\\s*"(?:[^"\\\\]|\\\\.)*"`),
    `${key}: "${newValue}"`
  );
}

// ── Main ───────────────────────────────────────────────────────────────

const src = fs.readFileSync(FILE, "utf-8");
const lines = src.split("\n");

let stats = {
  total: 0,
  alreadyOk: 0,
  truncated: 0,
  unfixable: 0,
};
let beforeRatios: number[] = [];
let afterRatios: number[] = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const cm = line.match(/correct:\s*"([A-D])"/);
  if (!cm) continue;

  stats.total++;
  const correctLetter = cm[1] as Letter;

  // Extract all four option texts
  const opts: Record<Letter, string> = {} as any;
  let skip = false;
  for (const l of LETTERS) {
    const text = extractOption(line, l);
    if (text === null) {
      skip = true;
      break;
    }
    opts[l] = text;
  }
  if (skip) continue;

  const correctText = opts[correctLetter];
  const wrongLetters = LETTERS.filter((l) => l !== correctLetter);
  const wrongLens = wrongLetters.map((l) => opts[l].length);
  const maxWrongLen = Math.max(...wrongLens);

  const ratio = correctText.length / maxWrongLen;
  beforeRatios.push(ratio);

  if (ratio <= 1.25) {
    stats.alreadyOk++;
    afterRatios.push(ratio);
    continue;
  }

  // ── Try to truncate the correct answer ──
  // Goal: bring it to within ~1.2x of the longest wrong answer
  const targetLen = maxWrongLen * 1.1;

  let bestCandidate: string | null = null;
  let bestScore = Infinity; // lower = better (closer to target)

  for (const brk of BREAK_PATTERNS) {
    const idx = correctText.indexOf(brk);
    if (idx < 0) continue;

    const candidate = correctText.slice(0, idx);

    // Sanity checks
    if (candidate.length < 25) continue; // too short to be meaningful
    if (BAD_ENDINGS.test(candidate)) continue; // grammatically broken

    const score = Math.abs(candidate.length - targetLen);
    // Only accept if it actually brings us closer to the target
    if (candidate.length <= maxWrongLen * 1.35 && score < bestScore) {
      bestCandidate = candidate;
      bestScore = score;
    }
  }

  if (bestCandidate) {
    let newLine = lines[i];
    newLine = replaceOption(newLine, correctLetter, bestCandidate);
    lines[i] = newLine;
    stats.truncated++;
    afterRatios.push(bestCandidate.length / maxWrongLen);
  } else {
    stats.unfixable++;
    afterRatios.push(ratio);
  }
}

// ── Write the result ──────────────────────────────────────────────────
fs.writeFileSync(FILE, lines.join("\n"), "utf-8");

// ── Report ────────────────────────────────────────────────────────────
const avg = (arr: number[]) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const median = (arr: number[]) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

console.log("\n═══ Answer-Length Equalization Report ═══\n");
console.log(`Total questions:              ${stats.total}`);
console.log(`Already balanced (≤1.25x):    ${stats.alreadyOk}`);
console.log(`Imbalanced (>1.25x):          ${stats.truncated + stats.unfixable}`);
console.log(`  → Fixed via truncation:     ${stats.truncated}`);
console.log(`  → Could not fix:            ${stats.unfixable}`);
console.log();
console.log(
  `Before — avg correct/maxWrong ratio:    ${avg(beforeRatios).toFixed(2)}x  (median ${median(beforeRatios).toFixed(2)}x)`
);
console.log(
  `After  — avg correct/maxWrong ratio:    ${avg(afterRatios).toFixed(2)}x  (median ${median(afterRatios).toFixed(2)}x)`
);

// Distribution buckets
const buckets = (arr: number[]) => {
  const b = { "≤1.0x": 0, "1.0–1.25x": 0, "1.25–1.5x": 0, "1.5–2.0x": 0, ">2.0x": 0 };
  for (const r of arr) {
    if (r <= 1.0) b["≤1.0x"]++;
    else if (r <= 1.25) b["1.0–1.25x"]++;
    else if (r <= 1.5) b["1.25–1.5x"]++;
    else if (r <= 2.0) b["1.5–2.0x"]++;
    else b[">2.0x"]++;
  }
  return b;
};

console.log("\nBefore distribution:");
for (const [k, v] of Object.entries(buckets(beforeRatios))) {
  const pct = ((v / beforeRatios.length) * 100).toFixed(1);
  console.log(`  ${k.padEnd(12)} ${String(v).padStart(4)} questions  (${pct}%)`);
}

console.log("\nAfter distribution:");
for (const [k, v] of Object.entries(buckets(afterRatios))) {
  const pct = ((v / afterRatios.length) * 100).toFixed(1);
  console.log(`  ${k.padEnd(12)} ${String(v).padStart(4)} questions  (${pct}%)`);
}
