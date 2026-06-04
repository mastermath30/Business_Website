"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect } from "react";
import { BookOpen, ListChecks, Calendar, Brain } from "lucide-react";

const stats = [
  {
    icon: Brain,
    value: 1875,
    suffix: "",
    label: "MCQs in the bank",
    sub: "75 per topic, hand-tuned",
  },
  {
    icon: BookOpen,
    value: 25,
    suffix: "",
    label: "Lecture topics",
    sub: "Every Tesla STEM business unit",
  },
  {
    icon: ListChecks,
    value: 10,
    suffix: "",
    label: "Per study round",
    sub: "Rotates so you never see the same set",
  },
  {
    icon: Calendar,
    value: 2,
    suffix: "",
    label: "Semesters covered",
    sub: "Both terms, both finals",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function StatsBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="container relative mt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="mx-auto max-w-2xl text-center"
      >
        <div
          className="text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: "#16a34a" }}
        >
          The numbers
        </div>
        <h2 className="text-strong mt-4 font-display text-4xl font-bold text-balance md:text-5xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}>
          Built for the entire course.
        </h2>
        <p className="text-soft mx-auto mt-4 max-w-xl text-balance text-lg">
          One unified study system across both semesters. No syllabus drift, no
          gaps — every topic is covered.
        </p>
      </motion.div>

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {stats.map((s, i) => (
          <StatTile
            key={s.label}
            icon={<s.icon className="h-5 w-5" />}
            value={s.value}
            suffix={s.suffix}
            label={s.label}
            sub={s.sub}
            delay={0.15 + i * 0.08}
            inView={inView}
          />
        ))}
      </div>
    </section>
  );
}

function StatTile({
  icon,
  value,
  suffix,
  label,
  sub,
  delay,
  inView,
}: {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  sub: string;
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: EASE }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 22 } }}
      className="surface-card border-soft group relative overflow-hidden rounded-2xl p-6 md:p-7"
      style={{
        transition: "border-color 200ms ease, box-shadow 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(22, 163, 74, 0.45)";
        e.currentTarget.style.boxShadow =
          "0 12px 32px -10px rgba(22, 163, 74, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--surface-border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* subtle accent dot in corner */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 h-1.5 w-1.5 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "#16a34a",
          boxShadow: "0 0 10px rgba(22, 163, 74, 0.7)",
        }}
      />

      <span
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white"
        style={{
          background: "#16a34a",
          boxShadow: "0 2px 8px rgba(22, 163, 74, 0.25)",
        }}
      >
        {icon}
      </span>

      <div className="mt-5 font-display text-4xl font-extrabold tabular-nums tracking-tight text-foreground md:text-5xl">
        <CountUpSpring inView={inView} target={value} duration={1.6} />
        {suffix}
      </div>
      <div className="text-strong mt-1.5 text-sm font-semibold">{label}</div>
      <div className="text-soft mt-0.5 text-xs">{sub}</div>
    </motion.div>
  );
}

function CountUpSpring({
  target,
  duration,
  inView,
}: {
  target: number;
  duration: number;
  inView: boolean;
}) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 60,
    damping: 18,
    mass: 1,
    duration,
  });
  const display = useTransform(spring, (latest: number) =>
    Math.round(latest).toLocaleString()
  );

  useEffect(() => {
    if (inView) motionValue.set(target);
  }, [inView, target, motionValue]);

  return <motion.span>{display}</motion.span>;
}
