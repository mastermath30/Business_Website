"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Search,
  Sparkles,
} from "lucide-react";
import { Topbar } from "@/components/dashboard/Topbar";
import { powerpoints } from "@/lib/db/seed";
import { getSessions, type QuizSession } from "@/lib/localStorage";

type SemKey = 1 | 2;

const SEM_THEME = {
  1: {
    accent: "#8dc63f",
    accentDim: "#6fa832",
    grad: "linear-gradient(135deg, #8dc63f 0%, #2563a8 100%)",
    barGrad: "linear-gradient(90deg, #8dc63f, #2563a8)",
    softBg:
      "linear-gradient(135deg, rgba(141,198,63,0.07) 0%, rgba(255,255,255,0) 60%)",
    pill: "rgba(141,198,63,0.10)",
    pillBorder: "rgba(141,198,63,0.4)",
    pillText: "#6fa832",
    glow: "rgba(141, 198, 63, 0.30)",
  },
  2: {
    accent: "#2563a8",
    accentDim: "#1a5fa8",
    grad: "linear-gradient(135deg, #2563a8 0%, #5ba3d9 100%)",
    barGrad: "linear-gradient(90deg, #2563a8, #5ba3d9)",
    softBg:
      "linear-gradient(135deg, rgba(37,99,168,0.07) 0%, rgba(255,255,255,0) 60%)",
    pill: "rgba(37,99,168,0.10)",
    pillBorder: "rgba(91,163,217,0.4)",
    pillText: "#2563a8",
    glow: "rgba(37, 99, 168, 0.30)",
  },
} as const satisfies Record<SemKey, unknown>;

const SPRING_LIFT = { type: "spring" as const, stiffness: 320, damping: 24 };
const EASE = [0.16, 1, 0.3, 1] as const;
const POOL_SIZE = 50;

export default function TopicsPage() {
  const [q, setQ] = useState("");
  const [sessions, setSessions] = useState<QuizSession[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const sem1 = useMemo(
    () => powerpoints.filter((p) => p.semester === 1),
    []
  );
  const sem2 = useMemo(
    () => powerpoints.filter((p) => p.semester === 2),
    []
  );

  const filterFn = (p: typeof powerpoints[number]) =>
    p.topic_name.toLowerCase().includes(q.toLowerCase());

  const filtered1 = sem1.filter(filterFn);
  const filtered2 = sem2.filter(filterFn);
  const totalFiltered = filtered1.length + filtered2.length;

  function sessionCount(id: string) {
    return sessions.filter((s) => s.lessonKey === id).length;
  }
  function bestScore(id: string): number | null {
    const ls = sessions.filter((s) => s.lessonKey === id);
    return ls.length > 0 ? Math.max(...ls.map((s) => s.score)) : null;
  }

  return (
    <>
      <Topbar title="Topics" />
      <div className="relative px-4 py-10 md:px-10 md:py-14">
        {/* ambient brand gradient wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(141, 198, 63, 0.10), rgba(37, 99, 168, 0.05) 40%, transparent 80%)",
          }}
        />

        {/* Header */}
        <header className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
                style={{
                  background: "rgba(141, 198, 63, 0.10)",
                  border: "1px solid rgba(141, 198, 63, 0.4)",
                  color: "#6fa832",
                }}
              >
                <Sparkles className="h-3 w-3" />
                Topic library
              </div>
              <h1
                className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] md:text-5xl"
                style={{ color: "#0a0a0a" }}
              >
                Pick a topic.{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #8dc63f 0%, #2563a8 100%)",
                  }}
                >
                  Sharpen up.
                </span>
              </h1>
              <p
                className="mt-3 max-w-xl text-sm md:text-[15px]"
                style={{ color: "#6b7280" }}
              >
                {powerpoints.length} lessons across 2 semesters · 50 MCQs per
                topic. Choose a topic to start a 10-question round.
              </p>
            </div>

            {/* Stylish search */}
            <div className="relative w-full md:w-80">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: "#9ca3af" }}
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search topics…"
                className="h-12 w-full rounded-full pl-11 pr-4 text-sm outline-none transition-all"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  color: "#0a0a0a",
                  boxShadow: "0 1px 2px rgba(15, 35, 56, 0.04)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#8dc63f";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 4px rgba(141, 198, 63, 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow =
                    "0 1px 2px rgba(15, 35, 56, 0.04)";
                }}
              />
            </div>
          </motion.div>
        </header>

        {/* Empty state */}
        {totalFiltered === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mx-auto mt-16 max-w-xl rounded-3xl border border-dashed p-14 text-center"
            style={{ borderColor: "#e5e7eb", background: "#ffffff" }}
          >
            <div
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                background: "rgba(141, 198, 63, 0.10)",
                color: "#6fa832",
              }}
            >
              <Search className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm" style={{ color: "#374151" }}>
              No topics match{" "}
              <span className="font-mono font-semibold">&ldquo;{q}&rdquo;</span>
              .
            </p>
          </motion.div>
        )}

        {/* Sections */}
        <div className="mx-auto mt-12 max-w-7xl space-y-16">
          {[
            { label: "Semester 1", items: filtered1, n: 1 as SemKey },
            { label: "Semester 2", items: filtered2, n: 2 as SemKey },
          ].map(({ label, items, n }) =>
            items.length === 0 ? null : (
              <section key={n}>
                <SemesterHeader semester={n} label={label} count={items.length} />
                <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((lesson, i) => (
                    <TopicCard
                      key={lesson.id}
                      lesson={lesson}
                      semester={n}
                      index={i}
                      sessions={sessionCount(lesson.id)}
                      best={bestScore(lesson.id)}
                    />
                  ))}
                </div>
              </section>
            )
          )}
        </div>
      </div>
    </>
  );
}

// ── Section header ──────────────────────────────────────────────────────────

function SemesterHeader({
  semester,
  label,
  count,
}: {
  semester: SemKey;
  label: string;
  count: number;
}) {
  const t = SEM_THEME[semester];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex items-center gap-4"
    >
      <span
        className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
        style={{
          background: t.grad,
          boxShadow: `0 8px 22px -6px ${t.glow}`,
        }}
      >
        <Calendar className="h-5 w-5" />
      </span>
      <div className="flex flex-1 items-baseline gap-3">
        <h2
          className="font-display text-2xl font-bold tracking-[-0.01em] md:text-3xl"
          style={{ color: "#0a0a0a" }}
        >
          {label}
        </h2>
        <span
          className="rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold tabular-nums"
          style={{
            background: t.pill,
            border: `1px solid ${t.pillBorder}`,
            color: t.pillText,
          }}
        >
          {count} {count === 1 ? "topic" : "topics"}
        </span>
      </div>
      {/* gradient divider */}
      <div
        aria-hidden
        className="hidden h-px flex-1 md:block"
        style={{
          background: `linear-gradient(90deg, ${t.accent}40 0%, transparent 100%)`,
        }}
      />
    </motion.div>
  );
}

// ── Topic card ──────────────────────────────────────────────────────────────

function TopicCard({
  lesson,
  semester,
  index,
  sessions,
  best,
}: {
  lesson: typeof powerpoints[number];
  semester: SemKey;
  index: number;
  sessions: number;
  best: number | null;
}) {
  const t = SEM_THEME[semester];
  const started = sessions > 0;

  // Display progress: if studied, use best score / 10; else 0/50.
  const progressPct = best !== null ? (best / 10) * 100 : 0;
  const progressLabel =
    best !== null ? `Best: ${best}/10` : `0/${POOL_SIZE} answered`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.04, 0.4),
        ease: EASE,
      }}
      whileHover={{ y: -6, transition: SPRING_LIFT }}
      className="group relative overflow-hidden rounded-3xl"
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(15, 35, 56, 0.04)",
        willChange: "transform",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = t.accent;
        e.currentTarget.style.boxShadow = `0 16px 40px -16px ${t.glow}, 0 4px 12px rgba(15, 35, 56, 0.06)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(15, 35, 56, 0.04)";
      }}
    >
      {/* colored top accent bar */}
      <div
        className="h-1.5 w-full"
        style={{ background: t.grad }}
        aria-hidden
      />

      {/* ambient soft wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: t.softBg }}
      />

      <div className="relative p-7 md:p-8">
        {/* Top row: icon + status pill */}
        <div className="flex items-start justify-between">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-105"
            style={{
              background: t.grad,
              boxShadow: `0 8px 18px -6px ${t.glow}`,
            }}
          >
            <BookOpen className="h-5 w-5" />
          </span>
          {started ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em]"
              style={{
                background: "rgba(141, 198, 63, 0.10)",
                border: "1px solid rgba(141, 198, 63, 0.4)",
                color: "#6fa832",
              }}
            >
              <CheckCircle2 className="h-3 w-3" />
              {sessions} done
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em]"
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                color: "#9ca3af",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "#9ca3af" }}
              />
              Not started
            </span>
          )}
        </div>

        {/* Topic name */}
        <h3
          className="mt-6 font-display text-xl font-bold leading-tight tracking-tight md:text-[22px]"
          style={{ color: "#0a0a0a" }}
        >
          {lesson.topic_name}
        </h3>

        {/* Meta line */}
        <div
          className="mt-2 flex items-center gap-2 text-xs font-medium"
          style={{ color: "#6b7280" }}
        >
          <span>Sem {lesson.semester}</span>
          <span style={{ color: "#d1d5db" }}>·</span>
          <span>{POOL_SIZE} questions</span>
        </div>

        {/* Progress block */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em]">
            <span style={{ color: "#6b7280" }}>{progressLabel}</span>
            {best !== null && (
              <span
                className="font-mono tabular-nums"
                style={{ color: t.accentDim }}
              >
                {Math.round(progressPct)}%
              </span>
            )}
          </div>
          <div
            className="h-2 overflow-hidden rounded-full"
            style={{ background: "rgba(15, 35, 56, 0.06)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progressPct}%` }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              className="h-full rounded-full"
              style={{
                background: t.barGrad,
                boxShadow: best !== null ? `0 0 10px ${t.glow}` : "none",
              }}
            />
          </div>
        </div>

        {/* CTA — full-width button */}
        <Link
          href={`/study/${lesson.semester}/${encodeURIComponent(
            lesson.id
          )}/quiz?mode=study`}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all"
          style={{
            background: t.grad,
            color: "#ffffff",
            boxShadow: `0 8px 22px -8px ${t.glow}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 12px 28px -8px ${t.glow}, 0 0 0 4px ${t.pill}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 8px 22px -8px ${t.glow}`;
          }}
        >
          Start quiz
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}
