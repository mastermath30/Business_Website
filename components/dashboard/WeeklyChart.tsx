"use client";

import { motion } from "framer-motion";
import { weeklyMinutesSeries } from "@/lib/data";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeeklyChart() {
  const max = Math.max(...weeklyMinutesSeries);
  const total = weeklyMinutesSeries.reduce((a, b) => a + b, 0);
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">This week</div>
          <div className="text-xs text-muted-foreground">
            <span className="font-mono">{total}m</span> total · avg{" "}
            <span className="font-mono">
              {Math.round(total / 7)}m
            </span>
            /day
          </div>
        </div>
        <span className="rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
          ↑ 18% vs last week
        </span>
      </div>
      <div className="mt-6 flex items-end justify-between gap-2 h-36">
        {weeklyMinutesSeries.map((v, i) => {
          const h = (v / max) * 100;
          return (
            <div
              key={i}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative w-full overflow-hidden rounded-md"
                style={{
                  background:
                    "linear-gradient(180deg, hsl(265 89% 66%), hsl(217 91% 60%))",
                }}
              >
                <div className="absolute inset-x-0 top-0 h-1/3 bg-white/10" />
              </motion.div>
              <span className="text-[10px] text-muted-foreground">{days[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
