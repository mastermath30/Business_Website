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
}

const steps: Step[] = [
  {
    n: "1",
    icon: Calendar,
    title: "Choose your semester",
    body: "Semester 1 or Semester 2, your choice. Each course already has its lecture decks loaded, so you can jump in immediately. No setup, no hunting for materials. Just open the semester and start studying.",
    iconGradient: "#16a34a",
    span: "wide",
  },
  {
    n: "2",
    icon: FolderOpen,
    title: "Pick a topic",
    body: "Topics extracted from each lecture appear as cards. Choose what you actually need to study tonight.",
    iconGradient: "#16a34a",
    span: "narrow",
  },
  {
    n: "3",
    icon: Sparkles,
    title: "Study mode · 10 questions",
    body: "10 MCQs per session. Retake anytime for a fresh set.",
    iconGradient: "#16a34a",
    span: "narrow",
  },
  {
    n: "4",
    icon: GraduationCap,
    title: "Final exam · 50 questions",
    body: "Optional timed exam pulling from every topic in the semester. Score summary, gaps highlighted, ready for the real thing.",
    iconGradient: "#16a34a",
    span: "wide",
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
          style={{ color: "#16a34a" }}
        >
          How the study tool works
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE_OUT_CUBIC }}
          className="mt-4 font-display text-4xl font-bold text-balance text-foreground md:text-5xl"
          style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
        >
          Studying that actually sticks.
        </motion.h2>
      </div>

      {/* Bento grid with decorative gradient line on left */}
      <div className="relative mx-auto mt-16 max-w-6xl">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-3 top-0 hidden h-full w-px md:block"
          style={{
            background:
              "linear-gradient(180deg, rgba(22,163,74,0.5) 0%, transparent 100%)",
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
      whileHover={{ y: -4, transition: SPRING_CARD }}
      className={`group relative overflow-hidden rounded-[20px] p-7 md:p-9 ${className ?? ""}`}
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--surface-border)",
        transform: "translateZ(0)",
        transition: "border-color 200ms ease, box-shadow 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(22, 163, 74, 0.45)";
        e.currentTarget.style.boxShadow =
          "0 12px 32px -8px rgba(22, 163, 74, 0.14), 0 4px 12px rgba(0, 0, 0, 0.07)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--surface-border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[20px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "rgba(22, 163, 74, 0.5)" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-2 z-0 select-none font-display text-[80px] font-black leading-none md:text-[96px]"
        style={{ color: "rgba(22, 163, 74, 0.1)" }}
      >
        {step.n}
      </span>

      <div className="relative z-10">
        <span
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white"
          style={{
            background: step.iconGradient,
            boxShadow: "0 2px 8px rgba(22, 163, 74, 0.25)",
          }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div
          className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Step {step.n}
        </div>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">
          {step.title}
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
          {step.body}
        </p>
      </div>
    </motion.div>
  );
}
