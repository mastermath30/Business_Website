"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import type { Topic } from "@/lib/types";
import { cn } from "@/lib/utils";

const colorMap: Record<Topic["color"], { bg: string; text: string; bar: string }> = {
  blue: {
    bg: "from-brand-blue/30 to-transparent",
    text: "text-brand-blue",
    bar: "from-brand-blue to-brand-cyan",
  },
  purple: {
    bg: "from-brand-purple/30 to-transparent",
    text: "text-brand-purple",
    bar: "from-brand-purple to-brand-pink",
  },
  cyan: {
    bg: "from-brand-cyan/30 to-transparent",
    text: "text-brand-cyan",
    bar: "from-brand-cyan to-brand-blue",
  },
  pink: {
    bg: "from-brand-pink/30 to-transparent",
    text: "text-brand-pink",
    bar: "from-brand-pink to-brand-purple",
  },
  amber: {
    bg: "from-amber-400/30 to-transparent",
    text: "text-amber-400",
    bar: "from-amber-400 to-brand-pink",
  },
  emerald: {
    bg: "from-emerald-400/30 to-transparent",
    text: "text-emerald-400",
    bar: "from-emerald-400 to-brand-cyan",
  },
};

export function TopicCard({
  topic,
  index = 0,
}: {
  topic: Topic;
  index?: number;
}) {
  const c = colorMap[topic.color];
  const pct = Math.round((topic.masteredCount / topic.questionCount) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl transition-all hover:border-white/[0.12] hover:-translate-y-0.5"
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-radial opacity-60 blur-2xl",
          c.bg
        )}
        style={{
          background: `radial-gradient(circle at center, var(--tw-gradient-from, transparent), transparent 60%)`,
        }}
      />

      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-2xl">
          {topic.emoji}
        </div>
        <span className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          {topic.course}
        </span>
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
        {topic.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {topic.description}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {topic.masteredCount}
          <span className="text-foreground/40">/{topic.questionCount}</span>{" "}
          mastered
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {topic.estimatedMinutes}m
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full bg-gradient-to-r transition-[width] duration-700",
            c.bar
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <Link
        href={`/quiz/${topic.id}`}
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
      >
        Start quiz
        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}
