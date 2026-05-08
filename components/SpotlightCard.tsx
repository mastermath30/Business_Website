"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  size?: number;
  color?: string;
}

export function SpotlightCard({
  children,
  className,
  size = 360,
  color = "hsl(263 89% 66% / 0.18)",
}: SpotlightCardProps) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 65%)`;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(-400);
        y.set(-400);
      }}
      className={cn(
        "group/spot relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl transition-colors hover:border-white/[0.12]",
        className
      )}
    >
      <motion.div
        aria-hidden
        style={{ background }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
