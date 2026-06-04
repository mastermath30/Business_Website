"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Calendar, FolderOpen, Sparkles, GraduationCap } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const steps = [
  {
    n: "1",
    icon: Calendar,
    title: "Pick a semester",
    body: "Sem 1 covers foundations — SWOT, factors of production, market types, intro micro & macro. Sem 2 is application — supply & demand, BMC, segmentation, fiscal policy, game theory.",
  },
  {
    n: "2",
    icon: FolderOpen,
    title: "Choose a topic",
    body: "Each lecture deck is parsed into a single topic card. No syllabus dance — open the deck you have homework on and you're studying in seconds.",
  },
  {
    n: "3",
    icon: Sparkles,
    title: "Study mode · 10 questions",
    body: "10 sharp MCQs per round, drawn from a 75-question pool with rotation tracking. Retake anytime — you'll get a fresh set until you've cycled the entire bank.",
  },
  {
    n: "4",
    icon: GraduationCap,
    title: "Final exam · 50 questions",
    body: "Optional timed exam pulling from every topic in the term. Score summary, gaps highlighted by lesson, ready for the real Tesla STEM final.",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Subtle parallax on the title
  const titleY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.6, 1],
    [0, 1, 1, 0.6]
  );

  // Background ambient gradient drift
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="container relative mt-40 scroll-mt-24"
    >
      {/* parallax ambient background */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute left-1/2 top-0 h-[720px] w-[720px] -translate-x-1/2 rounded-full opacity-40 dark:opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(22,163,74,0.10) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>

      {/* Section header — parallax + scroll-fade */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="mx-auto max-w-2xl text-center"
      >
        <div
          className="text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: "#16a34a" }}
        >
          How it works
        </div>
        <h2
          className="text-strong mt-4 font-display text-4xl font-bold text-balance md:text-5xl"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
        >
          Four moves, dialed for retention.
        </h2>
        <p className="text-soft mx-auto mt-4 max-w-xl text-balance text-lg">
          No clutter, no lock-in. Just the loop that gets you exam-ready.
        </p>
      </motion.div>

      {/* Vertical timeline with sticky-line + reveal-on-scroll cards */}
      <div className="relative mx-auto mt-20 max-w-3xl">
        {/* central animated progress line */}
        <ScrollLine progress={scrollYProgress} />

        <ul className="relative space-y-16 md:space-y-24">
          {steps.map((step, i) => (
            <StoryCard
              key={step.n}
              step={step}
              index={i}
              align={i % 2 === 0 ? "left" : "right"}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ScrollLine({ progress }: { progress: MotionValue<number> }) {
  const lineHeight = useTransform(progress, [0.05, 0.85], ["0%", "100%"]);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block"
      style={{ background: "var(--surface-border)" }}
    >
      <motion.div
        style={{ height: lineHeight }}
        className="absolute inset-x-0 top-0 w-px"
      >
        <div
          className="h-full w-px"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, #16a34a 30%, #22d3ee 100%)",
            boxShadow: "0 0 12px rgba(22, 163, 74, 0.5)",
          }}
        />
      </motion.div>
    </div>
  );
}

function StoryCard({
  step,
  index,
  align,
}: {
  step: (typeof steps)[number];
  index: number;
  align: "left" | "right";
}) {
  const Icon = step.icon;
  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative md:grid md:grid-cols-2 md:gap-12"
    >
      {/* Center node */}
      <span
        aria-hidden
        className="absolute left-1/2 top-6 hidden h-3 w-3 -translate-x-1/2 rounded-full md:block"
        style={{
          background: "#16a34a",
          boxShadow: "0 0 0 4px var(--background), 0 0 16px rgba(22, 163, 74, 0.5)",
        }}
      />

      {/* Card slot */}
      <div className={align === "left" ? "md:pr-10" : "md:col-start-2 md:pl-10"}>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="surface-card border-soft relative overflow-hidden rounded-2xl p-7"
          style={{ transition: "border-color 200ms ease, box-shadow 200ms ease" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(22, 163, 74, 0.45)";
            e.currentTarget.style.boxShadow =
              "0 12px 32px -10px rgba(22, 163, 74, 0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--surface-border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* watermark step number */}
          <span
            aria-hidden
            className="pointer-events-none absolute right-5 top-3 select-none font-display text-[88px] font-black leading-none"
            style={{ color: "rgba(22, 163, 74, 0.08)" }}
          >
            {step.n}
          </span>

          <div className="relative">
            <span
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white"
              style={{
                background: "#16a34a",
                boxShadow: "0 2px 8px rgba(22, 163, 74, 0.25)",
              }}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div
              className="text-soft mt-5 font-mono text-[11px] uppercase tracking-[0.18em]"
            >
              Step {step.n}
            </div>
            <h3 className="text-strong mt-1.5 font-display text-2xl font-bold tracking-tight">
              {step.title}
            </h3>
            <p className="text-soft mt-2.5 text-[15px] leading-relaxed">
              {step.body}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.li>
  );
}
