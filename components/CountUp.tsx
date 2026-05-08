"use client";

import type { CSSProperties } from "react";
import { useCountUp } from "@/lib/hooks/useCountUp";

interface CountUpProps {
  value: number;
  duration?: number;
  delay?: number;
  format?: (n: number) => string;
  className?: string;
  style?: CSSProperties;
}

export function CountUp({
  value,
  duration,
  delay,
  format,
  className,
  style,
}: CountUpProps) {
  const ref = useCountUp<HTMLSpanElement>(value, { duration, delay, format });
  return (
    <span ref={ref} className={className} style={style}>
      {format ? format(0) : "0"}
    </span>
  );
}
