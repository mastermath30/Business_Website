"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Flame,
  Target,
  Trophy,
} from "lucide-react";
import { Topbar } from "@/components/dashboard/Topbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { LessonCard } from "@/components/dashboard/LessonCard";
import { Button } from "@/components/ui/button";
import { powerpoints } from "@/lib/db/seed";
import {
  getUser,
  getSessions,
  computeStats,
  getWeeklyActivity,
  relTime,
  type StoredUser,
  type QuizSession,
  type DashboardStats,
} from "@/lib/localStorage";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function DashboardPage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    xp: 0,
    level: 1,
    streak: 0,
    accuracy: 0,
    totalSessions: 0,
    totalCorrect: 0,
    totalAnswered: 0,
  });
  const [weekly, setWeekly] = useState<{ label: string; count: number }[]>([]);

  useEffect(() => {
    const u = getUser();
    const s = getSessions();
    setUser(u);
    setSessions(s);
    setStats(computeStats(s));
    setWeekly(getWeeklyActivity(s));
  }, []);

  const firstName = user?.name.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const featuredLessons = powerpoints.slice(0, 4);

  const recentSessions = [...sessions]
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(0, 5);

  const hasWeeklyData = weekly.some((d) => d.count > 0);
  const maxWeekly = Math.max(...weekly.map((d) => d.count), 1);

  function sessionCount(id: string) {
    return sessions.filter((s) => s.lessonKey === id).length;
  }
  function bestScore(id: string): number | null {
    const ls = sessions.filter((s) => s.lessonKey === id);
    return ls.length > 0 ? Math.max(...ls.map((s) => s.score)) : null;
  }

  return (
    <>
      <Topbar title="Overview" />
      <div className="px-4 py-8 md:px-8">
        {/* Greeting */}
        <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl md:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-brand-purple/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 -bottom-32 h-72 w-72 rounded-full bg-brand-cyan/20 blur-3xl"
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                <span className="text-gradient">
                  {greeting}, {firstName}.
                </span>
              </h2>
              {stats.totalSessions === 0 ? (
                <p className="mt-1 max-w-md text-muted-foreground">
                  Ready to start? Pick a lesson below and take your first quiz.
                </p>
              ) : (
                <p className="mt-1 max-w-md text-muted-foreground">
                  {stats.xp.toLocaleString()} XP · Level {stats.level} ·{" "}
                  {stats.streak > 0 ? `${stats.streak}-day streak` : "No active streak"}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="primary" size="lg">
                <Link href="/study">
                  <BookOpen className="h-4 w-4" />
                  Start studying
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            label="XP"
            value={stats.xp.toLocaleString()}
            hint={`Level ${stats.level}`}
            icon={<Trophy className="h-4 w-4" />}
            accent="purple"
            index={0}
          />
          <StatCard
            label="Streak"
            value={`${stats.streak} days`}
            hint={stats.streak > 0 ? "Keep it going" : "Start today"}
            icon={<Flame className="h-4 w-4" />}
            accent="amber"
            index={1}
          />
          <StatCard
            label="Accuracy"
            value={stats.totalAnswered > 0 ? `${stats.accuracy}%` : "—"}
            hint={
              stats.totalAnswered > 0
                ? `${stats.totalAnswered} answered`
                : "No quizzes yet"
            }
            icon={<Target className="h-4 w-4" />}
            accent="cyan"
            index={2}
          />
          <StatCard
            label="Sessions"
            value={`${stats.totalSessions}`}
            hint="Quizzes completed"
            icon={<Brain className="h-4 w-4" />}
            accent="emerald"
            index={3}
          />
        </section>

        {/* Weekly activity + recent sessions */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl">
              <div className="text-sm font-medium">This week</div>
              {hasWeeklyData ? (
                <div className="mt-6 flex h-36 items-end justify-between gap-2">
                  {weekly.map((d, i) => {
                    const h = (d.count / maxWeekly) * 100;
                    return (
                      <div
                        key={i}
                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                      >
                        {d.count > 0 ? (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{
                              duration: 0.7,
                              delay: i * 0.05,
                              ease: EASE,
                            }}
                            className="relative w-full overflow-hidden rounded-md"
                            title={`${d.count} session${d.count !== 1 ? "s" : ""}`}
                            style={{
                              background:
                                "linear-gradient(180deg, hsl(80 56% 51%), hsl(217 91% 60%))",
                            }}
                          >
                            <div className="absolute inset-x-0 top-0 h-1/3 bg-white/10" />
                          </motion.div>
                        ) : (
                          <div
                            className="w-full rounded-sm bg-secondary/60"
                            style={{ height: "4px" }}
                          />
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          {d.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-4 flex h-36 flex-col items-center justify-center gap-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    You haven&apos;t studied yet this week.
                  </p>
                  <Link
                    href="/study"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Start a quiz →
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="h-full rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl">
              <div className="text-sm font-medium">Recent activity</div>
              {recentSessions.length > 0 ? (
                <ul className="mt-4 space-y-1">
                  {recentSessions.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent/40"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm">{s.lessonTitle}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.score}/{s.totalQuestions} correct
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {relTime(s.completedAt)}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No activity yet — complete your first quiz to see it here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Continue studying */}
        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold tracking-tight">
                Continue studying
              </h3>
              <Link
                href="/dashboard/topics"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                All topics →
              </Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {featuredLessons.map((lesson, i) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  sessions={sessionCount(lesson.id)}
                  bestScore={bestScore(lesson.id)}
                  index={i}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-display text-lg font-semibold tracking-tight">
              More lessons
            </h3>
            <div className="mt-4 space-y-2">
              {powerpoints.slice(4, 9).map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/study/${lesson.semester}/${encodeURIComponent(lesson.id)}/quiz?mode=study`}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3 transition-colors hover:bg-accent"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/60 font-mono text-[10px] text-muted-foreground">
                    S{lesson.semester}
                  </span>
                  <span className="flex-1 truncate text-sm font-medium">
                    {lesson.topic_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {sessionCount(lesson.id) > 0
                      ? `${sessionCount(lesson.id)} done`
                      : "→"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
