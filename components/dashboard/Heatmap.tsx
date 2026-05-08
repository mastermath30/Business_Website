"use client";

import { motion } from "framer-motion";
import { generateHeatmap } from "@/lib/data";

const palette = [
  "bg-secondary/60",
  "bg-brand-purple/15 ring-1 ring-brand-purple/20",
  "bg-brand-purple/30 ring-1 ring-brand-purple/30",
  "bg-brand-purple/55 ring-1 ring-brand-purple/40",
  "bg-brand-purple ring-1 ring-brand-purple/60 shadow-[0_0_12px_-2px_hsl(265_89%_66%/0.6)]",
];

export function Heatmap() {
  const grid = generateHeatmap();
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Study heatmap</div>
          <div className="text-xs text-muted-foreground">
            Last 13 weeks · 184 minutes this week
          </div>
        </div>
        <div className="hidden items-center gap-1.5 text-[10px] text-muted-foreground sm:flex">
          <span>Less</span>
          {palette.map((p, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-sm ${p}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="mt-5 flex gap-1">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((v, di) => (
              <motion.span
                key={`${wi}-${di}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.005 * (wi * 7 + di),
                }}
                title={`${v} sessions`}
                className={`h-3 w-3 rounded-[3px] ${palette[v]}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
