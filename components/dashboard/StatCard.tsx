"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  delta?: string;
  hint?: string;
  accent?: "blue" | "purple" | "cyan" | "amber" | "emerald" | "pink";
  index?: number;
}

const accentMap: Record<NonNullable<StatCardProps["accent"]>, string> = {
  blue: "from-brand-blue/30 to-brand-blue/0 border-brand-blue/30 text-brand-blue",
  purple:
    "from-brand-purple/30 to-brand-purple/0 border-brand-purple/30 text-brand-purple",
  cyan: "from-brand-cyan/30 to-brand-cyan/0 border-brand-cyan/30 text-brand-cyan",
  amber: "from-amber-400/30 to-amber-400/0 border-amber-400/30 text-amber-400",
  emerald:
    "from-emerald-400/30 to-emerald-400/0 border-emerald-400/30 text-emerald-400",
  pink: "from-brand-pink/30 to-brand-pink/0 border-brand-pink/30 text-brand-pink",
};

export function StatCard({
  icon,
  label,
  value,
  delta,
  hint,
  accent = "purple",
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border bg-gradient-to-br",
            accentMap[accent]
          )}
        >
          {icon}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold tracking-tight">
          {value}
        </span>
        {delta && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">
            <TrendingUp className="h-3 w-3" />
            {delta}
          </span>
        )}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </motion.div>
  );
}
