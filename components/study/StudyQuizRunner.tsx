"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { pickRotatedQuestions } from "@/lib/db/seed";
import {
  getSeenQuestionIds,
  markQuestionsSeen,
  resetSeenQuestions,
} from "@/lib/quiz-session";
import { addSession } from "@/lib/localStorage";
import type {
  AnswerLetter,
  DbQuestion,
  Powerpoint,
  QuizMode,
} from "@/lib/db/schema";

const LETTERS: AnswerLetter[] = ["A", "B", "C", "D"];
const STUDY_QUESTION_COUNT = 10;
const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING_BTN = { type: "spring" as const, stiffness: 380, damping: 22 };

function optionsOf(q: DbQuestion) {
  return [q.option_a, q.option_b, q.option_c, q.option_d];
}

interface RunnerProps {
  topic: Powerpoint;
  pool: DbQuestion[];
  mode: QuizMode;
}

export function StudyQuizRunner({ topic, pool, mode }: RunnerProps) {
  const [questions, setQuestions] = useState<DbQuestion[] | null>(
    mode === "exam" ? pool : null
  );
  const [rotationReset, setRotationReset] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    if (mode !== "study") return;
    const seen = getSeenQuestionIds(topic.id);
    const { selected, rotationReset: didReset } = pickRotatedQuestions(
      pool,
      seen,
      STUDY_QUESTION_COUNT
    );
    if (didReset) resetSeenQuestions(topic.id);
    setQuestions(selected);
    setRotationReset(didReset);
  }, [mode, pool, topic.id]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerLetter>>({});
  const [done, setDone] = useState(false);
  const [savedSeen, setSavedSeen] = useState(false);
  const [savedSession, setSavedSession] = useState(false);
  const [shake, setShake] = useState(false);
  const totalCount = questions?.length ?? 0;
  const examSeconds = totalCount * 60;
  const [timeLeft, setTimeLeft] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (mode === "exam" && questions) setTimeLeft(questions.length * 60);
  }, [mode, questions]);

  const isStudy = mode === "study";
  const q = questions ? questions[index] : undefined;
  const current = q ? answers[q.id] : undefined;

  useEffect(() => {
    if (done || !questions) return;
    const t = setInterval(() => {
      if (isStudy) {
        setElapsed((s) => s + 1);
      } else {
        setTimeLeft((s) => {
          if (s <= 1) {
            clearInterval(t);
            setDone(true);
            return 0;
          }
          return s - 1;
        });
      }
    }, 1000);
    return () => clearInterval(t);
  }, [done, isStudy, questions]);

  const select = useCallback(
    (letter: AnswerLetter) => {
      if (!q) return;
      if (answers[q.id]) return;
      setAnswers((a) => ({ ...a, [q.id]: letter }));
      if (letter !== q.correct_answer) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    },
    [q, answers]
  );

  const goNext = useCallback(() => {
    if (!questions) return;
    setDirection(1);
    if (index >= questions.length - 1) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }, [index, questions]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  // Keyboard shortcuts: A/B/C/D to select, Enter/→ to advance, ← to go back
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done || !questions) return;
      const key = e.key.toUpperCase();
      if (["A", "B", "C", "D"].includes(key)) {
        e.preventDefault();
        select(key as AnswerLetter);
      } else if (e.key === "Enter" || e.key === "ArrowRight") {
        if (!current) return;
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select, goNext, goPrev, current, done, questions]);

  useEffect(() => {
    if (!done || !isStudy || !questions || savedSeen) return;
    markQuestionsSeen(
      topic.id,
      questions.map((qq) => qq.id)
    );
    setSavedSeen(true);
  }, [done, isStudy, questions, savedSeen, topic.id]);

  useEffect(() => {
    if (!done || !questions || savedSession) return;
    const score = questions.filter((q) => answers[q.id] === q.correct_answer).length;
    addSession({
      lessonKey: topic.id,
      lessonTitle: topic.topic_name,
      semester: topic.semester,
      score,
      totalQuestions: questions.length,
      completedAt: new Date().toISOString(),
      questionIds: questions.map((q) => q.id),
    });
    setSavedSession(true);
  }, [done, questions, savedSession, topic, answers]);

  const restart = () => {
    setIndex(0);
    setAnswers({});
    setDone(false);
    setElapsed(0);
    setSavedSeen(false);
    setSavedSession(false);
    setDirection(1);
    setShake(false);
    if (mode === "exam") {
      setTimeLeft(examSeconds);
    } else {
      const seen = getSeenQuestionIds(topic.id);
      const { selected, rotationReset: didReset } = pickRotatedQuestions(
        pool,
        seen,
        STUDY_QUESTION_COUNT
      );
      if (didReset) resetSeenQuestions(topic.id);
      setQuestions(selected);
      setRotationReset(didReset);
    }
  };

  if (!questions) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <QuizBackground />
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Preparing your quiz…
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <Completion
        topic={topic}
        questions={questions}
        answers={answers}
        seconds={isStudy ? elapsed : examSeconds - timeLeft}
        onRestart={restart}
        rotationReset={rotationReset}
      />
    );
  }

  if (!q) return null;

  const progress = ((index + 1) / questions.length) * 100;
  const showFeedback = !!current;
  const isCorrect = current && current === q.correct_answer;

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <QuizBackground />

      {/* Sticky header */}
      <header className="header-glass sticky top-0 z-30">
        <div className="container flex h-[68px] items-center gap-4">
          <Link
            href={`/study/${topic.semester}/${encodeURIComponent(topic.id)}`}
            className="text-soft surface-elevated inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all hover:scale-105 hover:text-foreground"
            aria-label="Exit quiz"
          >
            <X className="h-4 w-4" />
          </Link>

          <div className="hidden flex-col leading-tight md:flex">
            <span className="text-strong truncate text-sm font-semibold">
              {topic.topic_name}
            </span>
            <span
              className="text-[11px] font-medium uppercase tracking-[0.14em]"
              style={{ color: "#16a34a" }}
            >
              {isStudy ? "Study mode" : "Final exam"} · Sem {topic.semester}
            </span>
          </div>

          <div className="flex flex-1 items-center gap-3">
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-foreground/[0.07] dark:bg-white/[0.06]">
              <motion.div
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.55, ease: EASE }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #16a34a 0%, #22d3ee 100%)",
                  boxShadow: "0 0 14px rgba(22, 163, 74, 0.45)",
                }}
              />
            </div>
            <span className="text-mid font-mono text-xs font-bold tabular-nums">
              {index + 1}
              <span className="text-soft">/{questions.length}</span>
            </span>
          </div>

          {!isStudy && (
            <div
              className="hidden items-center rounded-full px-3 py-1.5 font-mono text-xs font-bold tabular-nums sm:inline-flex"
              style={
                timeLeft < 60
                  ? {
                      border: "1px solid rgba(239, 68, 68, 0.5)",
                      background: "rgba(239, 68, 68, 0.08)",
                      color: "#ef4444",
                      boxShadow: "0 0 12px rgba(239, 68, 68, 0.18)",
                    }
                  : {
                      background: "rgba(22, 163, 74, 0.10)",
                      border: "1px solid rgba(22, 163, 74, 0.45)",
                      color: "#16a34a",
                    }
              }
              title="Time remaining"
            >
              {fmt(timeLeft)}
            </div>
          )}
        </div>
      </header>

      <main className="relative flex min-h-[calc(100vh-68px)] items-start justify-center px-4 pt-10 pb-16 md:pt-14">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.section
            key={q.id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="w-full max-w-2xl"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Card — shakes on incorrect answer */}
            <motion.div
              animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 md:p-10"
            >
              {/* Question number pill */}
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
                className="mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
                style={{
                  background: "rgba(22, 163, 74, 0.12)",
                  border: "1px solid rgba(22, 163, 74, 0.40)",
                  color: "#16a34a",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "#16a34a",
                    boxShadow: "0 0 8px rgba(22, 163, 74, 0.8)",
                  }}
                />
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
                  Question {index + 1} of {questions.length}
                </span>
              </motion.div>

              {/* Question text */}
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
                className="mb-8 mt-6 text-balance text-xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-white md:text-2xl"
              >
                {q.question}
              </motion.h2>

              {/* Answer options */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.18 },
                  },
                }}
                className="space-y-3"
              >
                {optionsOf(q).map((text, i) => {
                  const letter = LETTERS[i];
                  const isSelected = current === letter;
                  const isCorrectChoice = letter === q.correct_answer;
                  const correctState = showFeedback && isCorrectChoice;
                  const incorrectState = showFeedback && isSelected && !isCorrectChoice;
                  return (
                    <AnswerOption
                      key={letter}
                      letter={letter}
                      text={text}
                      selected={isSelected}
                      correct={correctState}
                      incorrect={incorrectState}
                      locked={!!current}
                      onClick={() => select(letter)}
                    />
                  );
                })}
              </motion.div>

              {/* Keyboard hint — hidden on touch devices */}
              <p className="mt-4 hidden text-center text-xs text-zinc-400 md:block">
                Press A, B, C, or D to select
              </p>

              {/* Feedback explanation */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="mt-6 overflow-hidden"
                  >
                    <div
                      className="rounded-2xl p-5"
                      style={
                        isCorrect
                          ? {
                              border: "1px solid rgba(22, 163, 74, 0.45)",
                              background: "rgba(22, 163, 74, 0.07)",
                            }
                          : {
                              border: "1px solid rgba(239, 68, 68, 0.40)",
                              background: "rgba(239, 68, 68, 0.07)",
                            }
                      }
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" style={{ color: "#16a34a" }} />
                            <span style={{ color: "#16a34a" }}>Correct.</span>
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4" style={{ color: "#ef4444" }} />
                            <span style={{ color: "#ef4444" }}>
                              Not quite — the right answer is {q.correct_answer}.
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-mid mt-2 text-sm leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Full-width next button */}
              <button
                onClick={goNext}
                disabled={!current}
                className="mt-6 w-full rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {index === questions.length - 1 ? "See results →" : "Next question →"}
              </button>
            </motion.div>

            {/* Previous button below card */}
            {index > 0 && (
              <motion.button
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={goPrev}
                className="mt-4 flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </motion.button>
            )}
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}

function QuizBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(22,163,74,0.16) 0%, rgba(22,163,74,0) 65%)",
          filter: "blur(8px)",
        }}
        animate={{ x: [0, 30, 0], y: [0, 22, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-44 -right-40 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.12) 0%, rgba(34,211,238,0) 65%)",
          filter: "blur(10px)",
        }}
        animate={{ x: [0, -28, 0], y: [0, -32, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function AnswerOption({
  letter,
  text,
  selected,
  correct,
  incorrect,
  locked,
  onClick,
}: {
  letter: AnswerLetter;
  text: string;
  selected?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  locked?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
      }}
      onClick={onClick}
      disabled={locked}
      className={cn(
        "flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left text-sm font-medium transition-all duration-150 disabled:cursor-default",
        correct
          ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
          : incorrect
          ? "border-red-400 bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-100"
          : selected
          ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-700"
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
          correct || selected
            ? "bg-emerald-500 text-white"
            : incorrect
            ? "bg-red-400 text-white"
            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
        )}
      >
        {letter}
      </span>
      <span className="text-balance flex-1 leading-snug">{text}</span>
      <AnimatePresence>
        {correct && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ color: "#16a34a" }}
          >
            <CheckCircle2 className="h-5 w-5" />
          </motion.span>
        )}
        {incorrect && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ color: "#ef4444" }}
          >
            <X className="h-5 w-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function Completion({
  topic,
  questions,
  answers,
  seconds,
  onRestart,
  rotationReset,
}: {
  topic: Powerpoint;
  questions: DbQuestion[];
  answers: Record<string, AnswerLetter>;
  seconds: number;
  onRestart: () => void;
  rotationReset?: boolean;
}) {
  const correct = questions.filter(
    (q) => answers[q.id] === q.correct_answer
  ).length;
  const total = questions.length;
  const pct = total > 0 ? correct / total : 0;

  const band =
    correct >= 7
      ? { ring: "#16a34a", glow: "rgba(22, 163, 74, 0.45)", label: "Strong work" }
      : correct >= 5
      ? { ring: "#f59e0b", glow: "rgba(245, 158, 11, 0.45)", label: "Solid" }
      : { ring: "#ef4444", glow: "rgba(239, 68, 68, 0.45)", label: "Keep going" };

  return (
    <div className="surface-base relative min-h-screen overflow-hidden">
      <QuizBackground />

      <main className="container relative pb-20 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <div className="text-center">
            <div
              className="text-xs font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#16a34a" }}
            >
              Quiz complete
            </div>
            <h1 className="text-strong mt-4 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              {band.label}.
            </h1>
            <p className="text-soft mt-3 text-sm md:text-base">
              You completed{" "}
              <span className="text-strong">{topic.topic_name}</span>
              {seconds > 0 && (
                <>
                  {" "}
                  in{" "}
                  <span className="text-strong font-semibold">
                    {fmt(seconds)}
                  </span>
                </>
              )}
              .
            </p>
            {rotationReset && (
              <p
                className="mx-auto mt-3 max-w-md text-xs"
                style={{ color: "#16a34a" }}
              >
                You&apos;ve now seen every question in this topic. The pool just
                reset — your next round will draw fresh.
              </p>
            )}
          </div>

          <div className="mt-10 flex justify-center">
            <ScoreRing
              correct={correct}
              total={total}
              pct={pct}
              color={band.ring}
            />
          </div>

          <div className="mt-12">
            <div className="text-soft mb-4 text-xs font-semibold uppercase tracking-[0.22em]">
              Review · {total} questions
            </div>
            <ul className="space-y-2">
              {questions.map((q, i) => {
                const ans = answers[q.id];
                const ok = ans === q.correct_answer;
                return (
                  <motion.li
                    key={q.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * i, ease: EASE }}
                    className="flex items-start gap-3 rounded-xl border p-4"
                    style={
                      ok
                        ? {
                            borderColor: "rgba(22, 163, 74, 0.45)",
                            background: "rgba(22, 163, 74, 0.06)",
                          }
                        : {
                            borderColor: "rgba(239, 68, 68, 0.45)",
                            background: "rgba(239, 68, 68, 0.05)",
                          }
                    }
                  >
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={
                        ok
                          ? { background: "rgba(22, 163, 74, 0.18)", color: "#16a34a" }
                          : { background: "rgba(239, 68, 68, 0.16)", color: "#ef4444" }
                      }
                    >
                      {ok ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-strong text-sm leading-snug">
                        <span className="text-soft font-mono text-xs">Q{i + 1}.</span>{" "}
                        {q.question}
                      </div>
                      {!ok && (
                        <div className="text-mid mt-1.5 text-xs">
                          You answered{" "}
                          <span className="font-mono" style={{ color: "#ef4444" }}>
                            {ans ?? "—"}
                          </span>
                          . Correct answer:{" "}
                          <span className="font-mono" style={{ color: "#16a34a" }}>
                            {q.correct_answer}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING_BTN}
              onClick={onRestart}
              className="btn-primary px-6 py-3 text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              Retake with new questions
            </motion.button>
            <Link
              href={`/study/${topic.semester}`}
              className="btn-ghost px-6 py-3 text-sm"
            >
              <Sparkles className="h-4 w-4" />
              Back to topics
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function ScoreRing({
  correct,
  total,
  pct,
  color,
}: {
  correct: number;
  total: number;
  pct: number;
  color: string;
}) {
  const size = 220;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const [count, setCount] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1100;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * correct));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [correct]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--surface-border)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct) }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-strong font-display text-6xl font-black tabular-nums">
          {count}
          <span className="text-soft"> / {total}</span>
        </div>
        <div className="text-soft mt-1 font-mono text-xs uppercase tracking-[0.22em]">
          {Math.round(pct * 100)}% correct
        </div>
      </div>
    </div>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}
