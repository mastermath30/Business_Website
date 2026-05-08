"use client";

import type { ReactNode, CSSProperties } from "react";
import { useMagneticHover } from "@/lib/hooks/useMagneticHover";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  style?: CSSProperties;
}

export function Magnetic({
  children,
  strength = 0.3,
  className,
  style,
}: MagneticProps) {
  const ref = useMagneticHover<HTMLDivElement>({ strength });
  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: "inline-block",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
