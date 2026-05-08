"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import {
  Calendar,
  FolderOpen,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { EASE_OUT_CUBIC, SPRING_CARD, VIEW_OPTS } from "@/lib/animation";

interface Step {
  n: string;
  icon: typeof Calendar;
  title: string;
  body: string;
  iconGradient: string;
  span: "wide" | "narrow";
  surface?: string;
}

const steps: Step[] = [
  {
    n: "01",
    icon: Calendar,
    title: "Choose your semester",
    body: "Pick Semester 1 or Semester 2. Lecture decks for each course are pre-loaded — no setup, no syllabus dance. Open the term and get straight to studying.",
    iconGradient: "linear-gradient(135deg, #8dc63f, #2563a8)",
    span: "wide",
  },
  {
    n: "02",
    icon: FolderOpen,
    title: "Pick a topic",
    body: "Topics extracted from each lecture appear as cards. Choose what you actually need to study tonight.",
    iconGradient: "linear-gradient(135deg, #8dc63f, #2563a8)",
    span: "narrow",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Study mode · 10 questions",
    body: "10 sharp MCQs per session — pulled from 25 questions stored per topic. Retake anytime for a fresh set.",
    iconGradient: "linear-gradient(135deg, #8dc63f, #2563a8)",
    span: "narrow",
  },
  {
    n: "04",
    icon: GraduationCap,
    title: "Final exam · 50 questions",
    body: "Optional timed exam pulling from every topic in the semester. Score summary, gaps highlighted, ready for the real thing.",
    iconGradient: "linear-gradient(135deg, #8dc63f, #2563a8)",
    span: "wide",
    surface:
      "linear-gradient(180deg, #f9fafb 0%, rgba(141,198,63,0.07) 100%)",
  },
];

export function FeaturesBento() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEW_OPTS);

  return (
    <section
      id="features"
      ref={ref}
      className="container relative mt-32 scroll-mt-24"
    >
      {/* Section header */}
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_CUBIC }}
          className="text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: "#8dc63f" }}
        >
          How the study tool works
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE_OUT_CUBIC }}
          className="mt-4 font-display text-4xl font-bold tracking-tight text-balance md:text-5xl"
          style={{ color: "#0a0a0a" }}
        >
          Studying that actually sticks.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.16, ease: EASE_OUT_CUBIC }}
          className="mx-auto mt-4 max-w-2xl text-balance text-lg"
          style={{ color: "#6b7280" }}
        >
          Four moves, dialed-in for retention. No clutter — just the loop that
          gets you exam-ready.
        </motion.p>
      </div>

      {/* Bento grid with decorative gradient line on left */}
      <div className="relative mx-auto mt-16 max-w-6xl">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-3 top-0 hidden h-full w-px md:block"
          style={{
            background:
              "linear-gradient(180deg, rgba(141,198,63,0.6) 0%, rgba(141,198,63,0) 100%)",
          }}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {steps.map((step, i) => (
            <BentoCard
              key={step.n}
              step={step}
              inView={inView}
              index={i}
              className={
                step.span === "wide" ? "md:col-span-2" : "md:col-span-1"
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  step,
  inView,
  index,
  className,
}: {
  step: Step;
  inView: boolean;
  index: number;
  className?: string;
}) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.25 + index * 0.1,
        ease: EASE_OUT_CUBIC,
      }}
      whileHover={{ y: -6, transition: SPRING_CARD }}
      className={`group relative overflow-hidden rounded-[20px] p-7 transition-[border-color,box-shadow] duration-300 md:p-9 ${className ?? ""}`}
      style={{
        background: step.surface ?? "#f9fafb",
        border: "1px solid #e5e7eb",
        willChange: "transform",
        transform: "translateZ(0)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(141, 198, 63, 0.6)";
        e.currentTarget.style.boxShadow =
          "0 12px 40px -12px rgba(141, 198, 63, 0.35), 0 4px 20px rgba(0, 0, 0, 0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* hover glow halo */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[20px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(141, 198, 63, 0.18), transparent 70%)",
        }}
      />
      {/* decorative giant step number — light watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-2 z-0 select-none font-display text-[80px] font-black leading-none md:text-[96px]"
        style={{ color: "rgba(141, 198, 63, 0.18)" }}
      >
        {step.n}
      </span>

      <div className="relative z-10">
        <span
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white"
          style={{
            background: step.iconGradient,
            boxShadow: "0 4px 14px rgba(141, 198, 63, 0.3)",
          }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div
          className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "#6b7280" }}
        >
          Step {step.n}
        </div>
        <h3
          className="mt-2 font-display text-2xl font-bold tracking-tight"
          style={{ color: "#0a0a0a" }}
        >
          {step.title}
        </h3>
        <p
          className="mt-2 max-w-xl text-sm leading-relaxed md:text-[15px]"
          style={{ color: "#374151" }}
        >
          {step.body}
        </p>
      </div>
    </motion.div>
  );
}
