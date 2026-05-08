"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Flame,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";
import { activities } from "@/lib/data";
import { formatRelative } from "@/lib/utils";

const iconMap = {
  quiz_completed: { Icon: CheckCircle2, accent: "bg-success/10 text-success" },
  streak: { Icon: Flame, accent: "bg-amber-500/10 text-amber-400" },
  topic_uploaded: { Icon: Upload, accent: "bg-brand-blue/10 text-brand-blue" },
  mastered: { Icon: Sparkles, accent: "bg-brand-purple/10 text-brand-purple" },
  level_up: { Icon: TrendingUp, accent: "bg-brand-cyan/10 text-brand-cyan" },
} as const;

export function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Recent activity</div>
        <button className="text-xs text-muted-foreground hover:text-foreground">
          View all
        </button>
      </div>
      <ul className="mt-4 space-y-1">
        {activities.map((a, i) => {
          const { Icon, accent } = iconMap[a.type];
          return (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent/40"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{a.title}</div>
                {a.meta && (
                  <div className="text-xs text-muted-foreground">{a.meta}</div>
                )}
              </div>
              <div className="flex flex-col items-end gap-0.5">
                {a.xp ? (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    +{a.xp} XP
                  </span>
                ) : null}
                <span className="text-[10px] text-muted-foreground">
                  {formatRelative(a.at)}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
