"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Powerpoint } from "@/lib/db/schema";

const COLORS = [
  { bar: "from-brand-purple to-brand-cyan", text: "text-brand-purple" },
  { bar: "from-brand-blue to-brand-cyan", text: "text-brand-blue" },
  { bar: "from-brand-cyan to-brand-blue", text: "text-brand-cyan" },
  { bar: "from-amber-400 to-brand-purple", text: "text-amber-400" },
  { bar: "from-emerald-400 to-brand-cyan", text: "text-emerald-400" },
  { bar: "from-brand-pink to-brand-blue", text: "text-brand-pink" },
] as const;

export function LessonCard({
  lesson,
  sessions,
  bestScore,
  index = 0,
}: {
  lesson: Powerpoint;
  sessions: number;
  bestScore: number | null;
  index?: number;
}) {
  const c = COLORS[index % COLORS.length];
  const href = `/study/${lesson.semester}/${encodeURIComponent(lesson.id)}/quiz?mode=study`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl transition-all hover:border-white/[0.12] hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <span
          className="inline-flex rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider border border-border/60 bg-background/60 text-muted-foreground"
        >
          Sem {lesson.semester}
        </span>
        {sessions > 0 && (
          <span className="rounded-full border border-success/20 bg-success/10 px-2 py-0.5 font-mono text-[10px] text-success">
            {sessions} session{sessions !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
        {lesson.topic_name}
      </h3>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {bestScore !== null ? (
            <>
              Best: <span className="text-foreground font-medium">{bestScore}/10</span>
            </>
          ) : (
            "Not started"
          )}
        </span>
        <span className="font-mono">50 Qs</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full bg-gradient-to-r transition-[width] duration-700 ${c.bar}`}
          style={{ width: bestScore !== null ? `${(bestScore / 10) * 100}%` : "0%" }}
        />
      </div>

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
      >
        Start quiz
        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}
