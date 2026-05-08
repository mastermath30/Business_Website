// Client-side rotation tracker. Persists the set of question IDs already
// shown for each topic in localStorage, so retakes serve a fresh batch.
// Intentionally minimal — swap for a server-side `quiz_sessions` table when
// real auth + persistence land.

const STORAGE_KEY = "bb:quiz-seen:v1";

type SeenMap = Record<string, string[]>;

function readMap(): SeenMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as SeenMap) : {};
  } catch {
    return {};
  }
}

function writeMap(map: SeenMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Quota or privacy mode — silent failure is fine, rotation just resets.
  }
}

export function getSeenQuestionIds(topicId: string): Set<string> {
  const map = readMap();
  return new Set(map[topicId] ?? []);
}

export function markQuestionsSeen(topicId: string, ids: string[]) {
  if (ids.length === 0) return;
  const map = readMap();
  const current = new Set(map[topicId] ?? []);
  for (const id of ids) current.add(id);
  map[topicId] = Array.from(current);
  writeMap(map);
}

export function resetSeenQuestions(topicId: string) {
  const map = readMap();
  if (topicId in map) {
    delete map[topicId];
    writeMap(map);
  }
}
