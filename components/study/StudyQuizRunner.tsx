"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done || !questions) return;
      if (["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        select(LETTERS[parseInt(e.key) - 1]);
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
    const score = questions.filter((q) => answers[q.id] === q.correct_answer)
      .length;
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

  // ── Loading ─────────────────────────────────────────────────────────────
  if (!questions) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <QuizBackground />
        <div className="flex min-h-screen items-center justify-center">
          <div
            className="flex items-center gap-3 text-sm"
            style={{ color: "#6b7280" }}
          >
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
    <div className="relative min-h-screen overflow-hidden">
      <QuizBackground />

      {/* Sticky header */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{
          background: "rgba(255, 255, 255, 0.72)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          borderColor: "rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="container flex h-[68px] items-center gap-4">
          <Link
            href={`/study/${topic.semester}/${encodeURIComponent(topic.id)}`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all hover:scale-105"
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              color: "#6b7280",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
            aria-label="Exit quiz"
          >
            <X className="h-4 w-4" />
          </Link>

          <div className="hidden flex-col leading-tight md:flex">
            <span
              className="truncate text-sm font-semibold"
              style={{ color: "#0a0a0a" }}
            >
              {topic.topic_name}
            </span>
            <span
              className="text-[11px] font-medium uppercase tracking-[0.14em]"
              style={{ color: "#8dc63f" }}
            >
              {isStudy ? "Study mode" : "Final exam"} · Sem {topic.semester}
            </span>
          </div>

          <div className="flex flex-1 items-center gap-3">
            {/* Thicker animated gradient progress */}
            <div
              className="relative h-2.5 w-full overflow-hidden rounded-full"
              style={{ background: "rgba(0, 0, 0, 0.06)" }}
            >
              <motion.div
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.55, ease: EASE }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #8dc63f 0%, #5ba3d9 60%, #2563a8 100%)",
                  boxShadow: "0 0 14px rgba(141, 198, 63, 0.45)",
                }}
              />
            </div>
            <span
              className="font-mono text-xs font-bold tabular-nums"
              style={{ color: "#374151" }}
            >
              {index + 1}
              <span style={{ color: "#9ca3af" }}>/{questions.length}</span>
            </span>
          </div>

          {!isStudy && (
            <div
              className={cn(
                "hidden items-center rounded-full px-3 py-1.5 font-mono text-xs font-bold tabular-nums sm:inline-flex"
              )}
              style={
                timeLeft < 60
                  ? {
                      border: "1px solid rgba(239, 68, 68, 0.5)",
                      background: "#fef2f2",
                      color: "#ef4444",
                      boxShadow: "0 0 12px rgba(239, 68, 68, 0.18)",
                    }
                  : {
                      background: "rgba(141, 198, 63, 0.12)",
                      border: "1px solid rgba(141, 198, 63, 0.45)",
                      color: "#6fa832",
                    }
              }
              title="Time remaining"
            >
              {fmt(timeLeft)}
            </div>
          )}
        </div>
      </header>

      <main className="relative flex min-h-[calc(100vh-68px)] items-start justify-center px-4 pt-10 pb-40 md:pt-16">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.section
            key={q.id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 60 : -60, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative w-full max-w-3xl"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Frosted glass card */}
            <div
              className="relative overflow-hidden rounded-[28px] p-7 md:p-12"
              style={{
                background: "rgba(255, 255, 255, 0.78)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                boxShadow:
                  "0 24px 60px -16px rgba(15, 35, 56, 0.18), 0 6px 18px rgba(15, 35, 56, 0.06)",
              }}
            >
              {/* Stylized Q-number pill */}
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(141,198,63,0.18) 0%, rgba(37,99,168,0.14) 100%)",
                  border: "1px solid rgba(141, 198, 63, 0.45)",
                  color: "#6fa832",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "#8dc63f",
                    boxShadow: "0 0 8px rgba(141, 198, 63, 0.8)",
                  }}
                />
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
                  Question {index + 1} of {questions.length}
                </span>
              </motion.div>

              {/* Question text — XL bold */}
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
                className="mt-6 font-display text-3xl font-bold leading-[1.18] tracking-[-0.01em] text-balance md:text-4xl lg:text-[44px]"
                style={{ color: "#0a0a0a" }}
              >
                {q.question}
              </motion.h2>

              {/* Options — staggered */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.07, delayChildren: 0.18 },
                  },
                }}
                className="mt-8 grid gap-3 md:mt-10"
              >
                {optionsOf(q).map((text, i) => {
                  const letter = LETTERS[i];
                  const isSelected = current === letter;
                  const isCorrectChoice = letter === q.correct_answer;
                  const reveal = showFeedback;
                  const correctState = reveal && isCorrectChoice;
                  const incorrectState =
                    reveal && isSelected && !isCorrectChoice;
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

              {/* Explanation reveal */}
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
                              border: "1px solid rgba(141, 198, 63, 0.5)",
                              background:
                                "linear-gradient(135deg, rgba(141,198,63,0.10) 0%, rgba(141,198,63,0.04) 100%)",
                            }
                          : {
                              border: "1px solid rgba(239, 68, 68, 0.45)",
                              background:
                                "linear-gradient(135deg, rgba(254,242,242,1) 0%, rgba(254,226,226,0.6) 100%)",
                            }
                      }
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        {isCorrect ? (
                          <>
                            <CheckCircle2
                              className="h-4 w-4"
                              style={{ color: "#6fa832" }}
                            />
                            <span style={{ color: "#6fa832" }}>Correct.</span>
                          </>
                        ) : (
                          <>
                            <X
                              className="h-4 w-4"
                              style={{ color: "#ef4444" }}
                            />
                            <span style={{ color: "#dc2626" }}>
                              Not quite — the right answer is{" "}
                              {q.correct_answer}.
                            </span>
                          </>
                        )}
                      </div>
                      <p
                        className="mt-2 text-sm leading-relaxed"
                        style={{ color: "#374151" }}
                      >
                        {q.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Floating action row — Prev (ghost) + Next (prominent) */}
            <div className="mt-7 flex items-center justify-between">
              {index > 0 ? (
                <motion.button
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goPrev}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors"
                  style={{ color: "#6b7280" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#0a0a0a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#6b7280")
                  }
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </motion.button>
              ) : (
                <span />
              )}

              <NextButton
                disabled={!current}
                isFinal={index === questions.length - 1}
                onClick={goNext}
              />
            </div>
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ── Ambient background ──────────────────────────────────────────────────────

function QuizBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0" style={{ background: "#fafbfc" }} />
      <motion.div
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(141,198,63,0.22) 0%, rgba(141,198,63,0) 65%)",
          filter: "blur(8px)",
        }}
        animate={{ x: [0, 30, 0], y: [0, 22, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-44 -right-40 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,168,0.18) 0%, rgba(37,99,168,0) 65%)",
          filter: "blur(10px)",
        }}
        animate={{ x: [0, -28, 0], y: [0, -32, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15, 35, 56, 0.06) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 80%)",
        }}
      />
    </div>
  );
}

// ── Answer option tile ──────────────────────────────────────────────────────

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
  const interactive = !locked && !correct && !incorrect && !selected;

  let containerStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.85)",
    border: "1.5px solid #e5e7eb",
    boxShadow: "0 1px 2px rgba(15, 35, 56, 0.03)",
  };
  if (correct) {
    containerStyle = {
      background:
        "linear-gradient(135deg, rgba(141,198,63,0.12) 0%, rgba(141,198,63,0.06) 100%)",
      border: "1.5px solid #8dc63f",
      boxShadow: "0 0 0 4px rgba(141, 198, 63, 0.15)",
    };
  } else if (incorrect) {
    containerStyle = {
      background:
        "linear-gradient(135deg, rgba(239,68,68,0.10) 0%, rgba(239,68,68,0.04) 100%)",
      border: "1.5px solid #ef4444",
      boxShadow: "0 0 0 4px rgba(239, 68, 68, 0.12)",
    };
  } else if (selected) {
    containerStyle = {
      background: "rgba(141, 198, 63, 0.10)",
      border: "1.5px solid #8dc63f",
      boxShadow: "0 0 0 4px rgba(141, 198, 63, 0.12)",
    };
  }

  let badgeStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1.5px solid #e5e7eb",
    color: "#374151",
  };
  if (correct) {
    badgeStyle = {
      background: "linear-gradient(135deg, #8dc63f 0%, #6fa832 100%)",
      border: "1.5px solid transparent",
      color: "#ffffff",
      boxShadow: "0 4px 12px rgba(141, 198, 63, 0.40)",
    };
  } else if (incorrect) {
    badgeStyle = {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      border: "1.5px solid transparent",
      color: "#ffffff",
      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.40)",
    };
  } else if (selected) {
    badgeStyle = {
      background: "linear-gradient(135deg, #8dc63f 0%, #6fa832 100%)",
      border: "1.5px solid transparent",
      color: "#ffffff",
      boxShadow: "0 4px 12px rgba(141, 198, 63, 0.40)",
    };
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!interactive) return;
    e.currentTarget.style.background = "rgba(141, 198, 63, 0.06)";
    e.currentTarget.style.borderColor = "#8dc63f";
    e.currentTarget.style.boxShadow = "0 8px 24px -10px rgba(141, 198, 63, 0.45)";
    const badge = e.currentTarget.querySelector(
      "[data-letter-badge]"
    ) as HTMLElement | null;
    if (badge) {
      badge.style.background =
        "linear-gradient(135deg, #8dc63f 0%, #6fa832 100%)";
      badge.style.borderColor = "transparent";
      badge.style.color = "#ffffff";
      badge.style.boxShadow = "0 4px 12px rgba(141, 198, 63, 0.35)";
    }
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!interactive) return;
    e.currentTarget.style.background = "rgba(255, 255, 255, 0.85)";
    e.currentTarget.style.borderColor = "#e5e7eb";
    e.currentTarget.style.boxShadow = "0 1px 2px rgba(15, 35, 56, 0.03)";
    const badge = e.currentTarget.querySelector(
      "[data-letter-badge]"
    ) as HTMLElement | null;
    if (badge) {
      badge.style.background = "#ffffff";
      badge.style.borderColor = "#e5e7eb";
      badge.style.color = "#374151";
      badge.style.boxShadow = "none";
    }
  };

  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: EASE },
        },
      }}
      whileHover={interactive ? { scale: 1.015, y: -2 } : undefined}
      whileTap={!locked ? { scale: 0.985 } : undefined}
      transition={{ type: "spring", stiffness: 380, damping: 25 }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={locked}
      className="group relative flex w-full items-center gap-5 rounded-2xl px-5 py-5 text-left text-[15px] transition-[background,border-color,box-shadow] duration-200 ease-out disabled:cursor-default md:px-6 md:py-6 md:text-base"
      style={{
        ...containerStyle,
        willChange: "transform",
      }}
    >
      <span
        data-letter-badge
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold transition-all duration-200 md:h-12 md:w-12 md:text-lg"
        style={badgeStyle}
      >
        {letter}
      </span>
      <span
        className="flex-1 text-[15px] font-medium leading-snug md:text-base"
        style={{ color: "#0a0a0a" }}
      >
        {text}
      </span>
      <AnimatePresence>
        {correct && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0 }}
            transition={SPRING_BTN}
            style={{ color: "#6fa832" }}
          >
            <CheckCircle2 className="h-5 w-5" />
          </motion.span>
        )}
        {incorrect && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0 }}
            transition={SPRING_BTN}
            style={{ color: "#ef4444" }}
          >
            <X className="h-5 w-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ── Next / Finish button ────────────────────────────────────────────────────

function NextButton({
  disabled,
  isFinal,
  onClick,
}: {
  disabled: boolean;
  isFinal: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.04, y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      transition={SPRING_BTN}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold transition-opacity duration-200",
        disabled && "cursor-not-allowed opacity-40"
      )}
      style={{
        background:
          "linear-gradient(135deg, #8dc63f 0%, #6fa832 60%, #2563a8 140%)",
        color: "#0f2338",
        boxShadow: disabled
          ? "none"
          : "0 12px 28px -8px rgba(141, 198, 63, 0.6), 0 4px 10px rgba(141, 198, 63, 0.25)",
        willChange: "transform",
      }}
    >
      {isFinal ? "Finish" : "Next"}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </motion.button>
  );
}

// ── Results Screen ──────────────────────────────────────────────────────────

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
      ? {
          ring: "#8dc63f",
          glow: "rgba(141, 198, 63, 0.45)",
          label: "Strong work",
        }
      : correct >= 5
        ? {
            ring: "#f59e0b",
            glow: "rgba(245, 158, 11, 0.45)",
            label: "Solid",
          }
        : {
            ring: "#ef4444",
            glow: "rgba(239, 68, 68, 0.45)",
            label: "Keep going",
          };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <QuizBackground />

      <main className="container relative pt-20 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <div className="text-center">
            <div
              className="text-xs font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#8dc63f" }}
            >
              Quiz complete
            </div>
            <h1
              className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-5xl"
              style={{ color: "#0a0a0a" }}
            >
              {band.label}.
            </h1>
            <p
              className="mt-3 text-sm md:text-base"
              style={{ color: "#6b7280" }}
            >
              You completed{" "}
              <span style={{ color: "#0a0a0a" }}>{topic.topic_name}</span>
              {seconds > 0 && (
                <>
                  {" "}
                  in{" "}
                  <span style={{ color: "#0a0a0a", fontWeight: 600 }}>
                    {fmt(seconds)}
                  </span>
                </>
              )}
              .
            </p>
            {rotationReset && (
              <p
                className="mx-auto mt-3 max-w-md text-xs"
                style={{ color: "#6fa832" }}
              >
                You&apos;ve now seen every question in this topic. The pool
                just reset — your next round will draw fresh.
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
            <div
              className="mb-4 text-xs font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#6b7280" }}
            >
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
                    transition={{
                      duration: 0.3,
                      delay: 0.05 * i,
                      ease: EASE,
                    }}
                    className="flex items-start gap-3 rounded-xl border p-4"
                    style={
                      ok
                        ? {
                            borderColor: "#8dc63f",
                            background: "#f0fdf4",
                          }
                        : {
                            borderColor: "#ef4444",
                            background: "#fef2f2",
                          }
                    }
                  >
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={
                        ok
                          ? {
                              background: "rgba(141, 198, 63, 0.22)",
                              color: "#6fa832",
                            }
                          : {
                              background: "rgba(239, 68, 68, 0.18)",
                              color: "#dc2626",
                            }
                      }
                    >
                      {ok ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-sm leading-snug"
                        style={{ color: "#0a0a0a" }}
                      >
                        <span
                          className="font-mono text-xs"
                          style={{ color: "#6b7280" }}
                        >
                          Q{i + 1}.
                        </span>{" "}
                        {q.question}
                      </div>
                      {!ok && (
                        <div
                          className="mt-1.5 text-xs"
                          style={{ color: "#374151" }}
                        >
                          You answered{" "}
                          <span
                            className="font-mono"
                            style={{ color: "#dc2626" }}
                          >
                            {ans ?? "—"}
                          </span>
                          . Correct answer:{" "}
                          <span
                            className="font-mono"
                            style={{ color: "#6fa832" }}
                          >
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
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #8dc63f 0%, #6fa832 100%)",
                color: "#0f2338",
                boxShadow: "0 12px 28px -8px rgba(141, 198, 63, 0.55)",
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Retake with new questions
            </motion.button>
            <Link
              href={`/study/${topic.semester}`}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors"
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                color: "#374151",
              }}
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
          stroke="#e5e7eb"
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
        <div
          className="font-display text-6xl font-black tabular-nums"
          style={{ color: "#0a0a0a" }}
        >
          {count}
          <span style={{ color: "#9ca3af" }}> / {total}</span>
        </div>
        <div
          className="mt-1 font-mono text-xs uppercase tracking-[0.22em]"
          style={{ color: "#6b7280" }}
        >
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
