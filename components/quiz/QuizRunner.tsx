"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flag,
  Flame,
  Sparkles,
  Trophy,
  X,
  Zap,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Question, Topic } from "@/lib/types";

type AnswerState = { selected: number; correct: boolean } | null;

export function QuizRunner({
  topic,
  questions,
}: {
  topic: Topic;
  questions: Question[];
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [seconds, setSeconds] = useState(0);
  const [combo, setCombo] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [showXP, setShowXP] = useState<number | null>(null);
  const awardXP = useAppStore((s) => s.awardXP);

  const q = questions[index];
  const current = answers[q.id];
  const finished = index >= questions.length;

  // Timer
  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [finished]);

  const select = useCallback(
    (i: number) => {
      if (current) return;
      const correct = i === q.correctIndex;
      const next: AnswerState = { selected: i, correct };
      setAnswers((a) => ({ ...a, [q.id]: next }));

      if (correct) {
        const newCombo = combo + 1;
        setCombo(newCombo);
        const base = q.difficulty === "hard" ? 30 : q.difficulty === "medium" ? 20 : 12;
        const bonus = Math.min(newCombo - 1, 5) * 4;
        const xp = base + bonus;
        setXpGained((x) => x + xp);
        setShowXP(xp);
        awardXP(xp);
        setTimeout(() => setShowXP(null), 1100);
      } else {
        setCombo(0);
      }
    },
    [q, current, combo, awardXP]
  );

  const next = useCallback(() => {
    if (!current) return;
    setIndex((i) => i + 1);
  }, [current]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (finished) return;
      if (["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        select(parseInt(e.key) - 1);
      } else if (e.key === "Enter" || e.key === "ArrowRight") {
        if (current) next();
      } else if (e.key === "ArrowLeft") {
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select, next, prev, current, finished]);

  const stats = useMemo(() => {
    const list = Object.values(answers).filter(Boolean) as NonNullable<AnswerState>[];
    const correct = list.filter((a) => a.correct).length;
    const total = questions.length;
    const pct = list.length ? Math.round((correct / list.length) * 100) : 0;
    return { correct, total, pct, answered: list.length };
  }, [answers, questions.length]);

  if (finished) {
    return (
      <CompletionScreen
        topic={topic}
        questions={questions}
        answers={answers}
        seconds={seconds}
        xpGained={xpGained}
        bestCombo={combo}
        onRestart={() => {
          setIndex(0);
          setAnswers({});
          setSeconds(0);
          setCombo(0);
          setXpGained(0);
        }}
      />
    );
  }

  const progress = ((index + (current ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,hsl(263_89%_66%/0.35),transparent_60%)]"
      />

      {/* top bar */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link
            href="/dashboard/quizzes"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Exit quiz"
          >
            <X className="h-4 w-4" />
          </Link>

          <div className="flex flex-1 items-center gap-4">
            <span className="hidden text-2xl md:block">{topic.emoji}</span>
            <div className="hidden flex-col leading-tight md:flex">
              <span className="text-sm font-medium">{topic.title}</span>
              <span className="text-xs text-muted-foreground">
                {topic.course}
              </span>
            </div>
            <div className="flex flex-1 items-center gap-3">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-y-0 left-0 [background:linear-gradient(90deg,hsl(217_91%_60%),hsl(265_89%_66%),hsl(189_94%_55%))]"
                />
              </div>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {index + 1}/{questions.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Stat
              icon={<Flame className="h-3.5 w-3.5" />}
              value={combo}
              accent="amber"
              label="combo"
            />
            <Stat
              icon={<Zap className="h-3.5 w-3.5" />}
              value={xpGained}
              accent="purple"
              label="xp"
            />
            <Stat
              icon={null}
              value={fmt(seconds)}
              accent="muted"
              label="time"
              mono
            />
          </div>
        </div>
      </header>

      {/* XP burst */}
      <AnimatePresence>
        {showXP !== null && (
          <motion.div
            key="xp"
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -60, scale: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none fixed left-1/2 top-1/2 z-30 -translate-x-1/2"
          >
            <div className="rounded-full border border-brand-purple/30 bg-card/80 px-4 py-2 font-display text-2xl font-semibold text-gradient-brand shadow-glow backdrop-blur-xl">
              +{showXP} XP
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* question card */}
      <main className="container relative pt-12 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-2xl"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-border/60 bg-card/40 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                {q.difficulty}
              </span>
              {q.source && (
                <span className="text-[11px] text-muted-foreground">
                  Source · {q.source}
                </span>
              )}
            </div>

            <h2 className="mt-5 font-display text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
              {q.prompt}
            </h2>

            <div className="mt-8 space-y-2.5">
              {q.options.map((opt, i) => (
                <AnswerOption
                  key={i}
                  letter={String.fromCharCode(65 + i)}
                  text={opt}
                  selected={current?.selected === i}
                  correct={current && i === q.correctIndex}
                  incorrect={
                    current?.selected === i && i !== q.correctIndex
                  }
                  disabled={!!current}
                  onClick={() => select(i)}
                />
              ))}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {current && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: 8 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 overflow-hidden"
                >
                  <div
                    className={cn(
                      "rounded-2xl border p-5",
                      current.correct
                        ? "border-success/30 bg-success/5"
                        : "border-destructive/30 bg-destructive/5"
                    )}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {current.correct ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span className="text-success">Nice — that's correct.</span>
                        </>
                      ) : (
                        <>
                          <Flag className="h-4 w-4 text-destructive" />
                          <span className="text-destructive">
                            Not quite. The right answer is{" "}
                            {String.fromCharCode(65 + q.correctIndex)}.
                          </span>
                        </>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-foreground/85">
                      {q.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* nav */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={prev}
                disabled={index === 0}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="hidden items-center gap-1 text-[11px] text-muted-foreground md:flex">
                Press
                <kbd className="rounded-md border border-border/60 bg-card/40 px-1.5 py-0.5 font-mono">
                  1–4
                </kbd>
                to answer ·
                <kbd className="rounded-md border border-border/60 bg-card/40 px-1.5 py-0.5 font-mono">
                  ↵
                </kbd>
                to continue
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={next}
                disabled={!current}
              >
                {index === questions.length - 1 ? "Finish" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function Stat({
  icon,
  value,
  accent,
  label,
  mono,
}: {
  icon: React.ReactNode;
  value: string | number;
  accent: "amber" | "purple" | "muted";
  label: string;
  mono?: boolean;
}) {
  const c = {
    amber: "text-amber-400 border-amber-400/20 bg-amber-400/5",
    purple: "text-brand-purple border-brand-purple/20 bg-brand-purple/5",
    muted: "text-muted-foreground border-border/60 bg-card/40",
  } as const;
  return (
    <div
      className={cn(
        "hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs sm:inline-flex",
        c[accent]
      )}
      title={label}
    >
      {icon}
      <span className={cn(mono && "font-mono tabular-nums")}>{value}</span>
    </div>
  );
}

function AnswerOption({
  letter,
  text,
  selected,
  correct,
  incorrect,
  disabled,
  onClick,
}: {
  letter: string;
  text: string;
  selected?: boolean;
  correct?: boolean | null;
  incorrect?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.99 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex w-full items-center gap-4 rounded-2xl border bg-card/40 px-5 py-4 text-left text-[15px] transition-all backdrop-blur-xl",
        "hover:border-white/[0.18] hover:bg-card/60",
        "disabled:cursor-default",
        correct && "border-success/40 bg-success/10",
        incorrect && "border-destructive/40 bg-destructive/10",
        !correct && !incorrect && selected && "border-primary/40 bg-primary/10"
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-medium transition-colors",
          correct
            ? "border-success/40 bg-success/20 text-success"
            : incorrect
              ? "border-destructive/40 bg-destructive/20 text-destructive"
              : "border-border/60 bg-background/60 text-muted-foreground group-hover:text-foreground"
        )}
      >
        {letter}
      </span>
      <span className="flex-1">{text}</span>
      <AnimatePresence>
        {correct && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0 }}
            className="text-success"
          >
            <CheckCircle2 className="h-5 w-5" />
          </motion.span>
        )}
        {incorrect && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0 }}
            className="text-destructive"
          >
            <X className="h-5 w-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function CompletionScreen({
  topic,
  questions,
  answers,
  seconds,
  xpGained,
  bestCombo,
  onRestart,
}: {
  topic: Topic;
  questions: Question[];
  answers: Record<string, AnswerState>;
  seconds: number;
  xpGained: number;
  bestCombo: number;
  onRestart: () => void;
}) {
  const correct = questions.filter((q) => answers[q.id]?.correct).length;
  const pct = Math.round((correct / questions.length) * 100);
  const grade =
    pct >= 90 ? "Outstanding" : pct >= 75 ? "Strong" : pct >= 60 ? "Solid" : "Keep going";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:conic-gradient(from_180deg_at_50%_50%,hsl(217_91%_60%/0.25),hsl(263_89%_66%/0.25),hsl(189_94%_55%/0.25),hsl(217_91%_60%/0.25))] opacity-50 blur-3xl"
      />
      <Confetti />

      <main className="container relative pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0.6, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              damping: 12,
              stiffness: 120,
              delay: 0.2,
            }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.08] [background:linear-gradient(135deg,hsl(217_91%_60%),hsl(265_89%_66%),hsl(189_94%_55%))] shadow-glow"
          >
            <Trophy className="h-9 w-9 text-white" />
          </motion.div>
          <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-gradient-brand">{grade}.</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            You finished {topic.title} in {fmt(seconds)} with{" "}
            <span className="text-foreground">
              {correct}/{questions.length}
            </span>{" "}
            correct.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            <ResultStat label="Score" value={`${pct}%`} accent="purple" />
            <ResultStat label="XP gained" value={`+${xpGained}`} accent="cyan" />
            <ResultStat label="Best combo" value={`${bestCombo}×`} accent="amber" />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <Button variant="primary" size="lg" onClick={onRestart}>
              <RotateCcw className="h-4 w-4" />
              Retry
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link href="/dashboard">
                <Sparkles className="h-4 w-4" />
                Back to dashboard
              </Link>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function ResultStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "purple" | "cyan" | "amber";
}) {
  const map = {
    purple: "from-brand-purple/30 to-brand-purple/0 border-brand-purple/30",
    cyan: "from-brand-cyan/30 to-brand-cyan/0 border-brand-cyan/30",
    amber: "from-amber-400/30 to-amber-400/0 border-amber-400/30",
  } as const;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={cn(
        "rounded-2xl border bg-gradient-to-b p-5 text-center backdrop-blur-xl",
        map[accent]
      )}
    >
      <div className="font-display text-3xl font-semibold tracking-tight text-gradient-brand">
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.6 + Math.random() * 1.4,
        rotate: Math.random() * 360,
        color: [
          "hsl(217 91% 60%)",
          "hsl(265 89% 66%)",
          "hsl(189 94% 55%)",
          "hsl(326 89% 66%)",
          "hsl(45 93% 60%)",
        ][i % 5],
      })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: -40, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", rotate: p.rotate, opacity: 0 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
          className="absolute top-0 h-2.5 w-1.5 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}
