import type { Semester } from "@/lib/db/schema";

export interface StoredUser {
  name: string;
  email: string;
  createdAt: string;
}

export interface QuizSession {
  lessonKey: string;
  lessonTitle: string;
  semester: Semester;
  score: number;
  totalQuestions: number;
  completedAt: string;
  questionIds: string[];
}

const USER_KEY = "bb:user";
const SESSIONS_KEY = "bb:sessions";

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function getUser(): StoredUser | null {
  return read<StoredUser>(USER_KEY);
}

export function saveUser(user: StoredUser) {
  write(USER_KEY, user);
}

export function getSessions(): QuizSession[] {
  return read<QuizSession[]>(SESSIONS_KEY) ?? [];
}

export function addSession(session: QuizSession) {
  const all = getSessions();
  all.push(session);
  write(SESSIONS_KEY, all);
}
