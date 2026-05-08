"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Flame, Target, Trophy } from "lucide-react";
import { Topbar } from "@/components/dashboard/Topbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { powerpoints } from "@/lib/db/seed";
import {
  getSessions,
  computeStats,
  getWeeklyActivity,
  buildHeatmapGrid,
  type QuizSession,
  type DashboardStats,
} from "@/lib/localStorage";

const EASE = [0.16, 1, 0.3, 1] as const;

const heatPalette = [
  "bg-secondary/60",
  "bg-brand-purple/15 ring-1 ring-brand-purple/20",
  "bg-brand-purple/30 ring-1 ring-brand-purple/30",
  "bg-brand-purple/55 ring-1 ring-brand-purple/40",
  "bg-brand-purple ring-1 ring-brand-purple/60 shadow-[0_0_12px_-2px_hsl(265_89%_66%/0.6)]",
];

function EmptyCard({ message }: { message: string }) {
  return (
    <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/20 p-6 text-center">
      <div>
        <p className="text-sm text-muted-foreground">{message}</p>
        <Link href="/study" className="mt-2 inline-block text-xs font-medium text-primary hover:underline">
          Start a quiz →
        </Link>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    xp: 0, level: 1, streak: 0, accuracy: 0,
    totalSessions: 0, totalCorrect: 0, totalAnswered: 0,
  });
  const [weekly, setWeekly] = useState<{ label: string; count: number }[]>([]);
  const [heatGrid, setHeatGrid] = useState<number[][]>([]);

  useEffect(() => {
    const s = getSessions();
    setSessions(s);
    setStats(computeStats(s));
    setWeekly(getWeeklyActivity(s));
    setHeatGrid(buildHeatmapGrid(s));
  }, []);

  const hasData = sessions.length > 0;
  const maxWeekly = Math.max(...weekly.map((d) => d.count), 1);

  // Lessons with at least one session
  const lessonStats = powerpoints
    .map((p) => {
      const ls = sessions.filter((s) => s.lessonKey === p.id);
      if (ls.length === 0) return null;
      const correct = ls.reduce((a, b) => a + b.score, 0);
      const total = ls.reduce((a, b) => a + b.totalQuestions, 0);
      return { lesson: p, pct: Math.round((correct / total) * 100), sessions: ls.length };
    })
    .filter(Boolean) as { lesson: (typeof powerpoints)[number]; pct: number; sessions: number }[];

  return (
    <>
      <Topbar title="Analytics" />
      <div className="px-4 py-8 md:px-8">
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          Your learning trajectory
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasData
            ? `${stats.totalSessions} sessions · ${stats.totalCorrect} correct answers`
            : "Complete quizzes to see your learning analytics here."}
        </p>

        {/* Stats */}
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard
            icon={<Trophy className="h-4 w-4" />}
            label="Total XP"
            value={stats.xp.toLocaleString()}
            hint={`Level ${stats.level}`}
            accent="purple"
          />
          <StatCard
            icon={<Flame className="h-4 w-4" />}
            label="Streak"
            value={`${stats.streak}d`}
            hint={stats.streak > 0 ? "Active" : "No streak yet"}
            accent="amber"
          />
          <StatCard
            icon={<Target className="h-4 w-4" />}
            label="Avg accuracy"
            value={hasData ? `${stats.accuracy}%` : "—"}
            hint={hasData ? `${stats.totalAnswered} questions` : "No data yet"}
            accent="cyan"
          />
          <StatCard
            icon={<Brain className="h-4 w-4" />}
            label="Sessions"
            value={`${stats.totalSessions}`}
            hint={`${powerpoints.length} lessons available`}
            accent="emerald"
          />
        </div>

        {/* Weekly activity chart */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl">
            <div className="text-sm font-medium">This week</div>
            {weekly.some((d) => d.count > 0) ? (
              <div className="mt-6 flex h-36 items-end justify-between gap-2">
                {weekly.map((d, i) => {
                  const h = (d.count / maxWeekly) * 100;
                  return (
                    <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                      {d.count > 0 ? (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                          className="relative w-full overflow-hidden rounded-md"
                          title={`${d.count} session${d.count !== 1 ? "s" : ""}`}
                          style={{ background: "linear-gradient(180deg, hsl(80 56% 51%), hsl(217 91% 60%))" }}
                        >
                          <div className="absolute inset-x-0 top-0 h-1/3 bg-white/10" />
                        </motion.div>
                      ) : (
                        <div className="w-full rounded-sm bg-secondary/60" style={{ height: "4px" }} />
                      )}
                      <span className="text-[10px] text-muted-foreground">{d.label}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 flex h-36 items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">No study sessions this week.</p>
              </div>
            )}
          </div>

          {/* Study heatmap */}
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Study heatmap</div>
                <div className="text-xs text-muted-foreground">Last 13 weeks</div>
              </div>
              <div className="hidden items-center gap-1.5 text-[10px] text-muted-foreground sm:flex">
                <span>Less</span>
                {heatPalette.map((p, i) => (
                  <span key={i} className={`h-2.5 w-2.5 rounded-sm ${p}`} />
                ))}
                <span>More</span>
              </div>
            </div>
            {hasData ? (
              <div className="mt-5 flex gap-1">
                {heatGrid.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((v, di) => (
                      <motion.span
                        key={`${wi}-${di}`}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.005 * (wi * 7 + di) }}
                        title={`${v} session${v !== 1 ? "s" : ""}`}
                        className={`h-3 w-3 rounded-[3px] ${heatPalette[v]}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 flex h-24 items-center justify-center text-center">
                <p className="text-xs text-muted-foreground">
                  Complete quizzes to see your study pattern here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Accuracy by lesson */}
        <section className="mt-6 rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold tracking-tight">
              Accuracy by lesson
            </h3>
            <span className="text-xs text-muted-foreground">
              {lessonStats.length} of {powerpoints.length} attempted
            </span>
          </div>
          {lessonStats.length > 0 ? (
            <div className="mt-6 space-y-3">
              {lessonStats.map(({ lesson, pct, sessions: sc }) => {
                const danger = pct < 40;
                return (
                  <div key={lesson.id} className="grid grid-cols-12 items-center gap-3">
                    <div className="col-span-5 flex items-center gap-2 md:col-span-4">
                      <span className="truncate text-sm">{lesson.topic_name}</span>
                    </div>
                    <div className="col-span-5 md:col-span-7">
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, ease: EASE }}
                          className={
                            danger
                              ? "h-full [background:linear-gradient(90deg,hsl(0_84%_60%),hsl(45_93%_60%))]"
                              : "h-full [background:linear-gradient(90deg,hsl(80_56%_51%),hsl(217_91%_60%))]"
                          }
                        />
                      </div>
                    </div>
                    <div className="col-span-2 text-right font-mono text-xs text-muted-foreground md:col-span-1">
                      {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyCard message="Complete quizzes to see accuracy by lesson here." />
          )}
        </section>
      </div>
    </>
  );
}
