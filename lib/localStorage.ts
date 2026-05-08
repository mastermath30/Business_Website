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

export interface DashboardStats {
  xp: number;
  level: number;
  streak: number;
  accuracy: number;
  totalSessions: number;
  totalCorrect: number;
  totalAnswered: number;
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

function dateKey(iso: string) {
  return iso.slice(0, 10);
}

export function computeStats(sessions: QuizSession[]): DashboardStats {
  const totalCorrect = sessions.reduce((s, q) => s + q.score, 0);
  const totalAnswered = sessions.reduce((s, q) => s + q.totalQuestions, 0);
  const xp = totalCorrect * 10;
  const level = Math.max(1, Math.floor(xp / 350) + 1);
  const accuracy =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const studiedDays = new Set(sessions.map((s) => dateKey(s.completedAt)));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (studiedDays.has(d.toISOString().slice(0, 10))) streak++;
    else break;
  }

  return {
    xp,
    level,
    streak,
    accuracy,
    totalSessions: sessions.length,
    totalCorrect,
    totalAnswered,
  };
}

export function getWeeklyActivity(
  sessions: QuizSession[]
): { label: string; count: number }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      count: sessions.filter((s) => dateKey(s.completedAt) === key).length,
    };
  });
}

export function buildHeatmapGrid(sessions: QuizSession[]): number[][] {
  const today = new Date();
  return Array.from({ length: 13 }, (_, wi) =>
    Array.from({ length: 7 }, (_, di) => {
      const d = new Date(today);
      d.setDate(today.getDate() - ((12 - wi) * 7 + (6 - di)));
      const key = d.toISOString().slice(0, 10);
      const count = sessions.filter((s) => dateKey(s.completedAt) === key).length;
      return Math.min(4, count);
    })
  );
}

export function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}
