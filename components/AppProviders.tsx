"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { PageTransition } from "./PageTransition";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <SmoothScrollProvider>
        <PageTransition>{children}</PageTransition>
      </SmoothScrollProvider>
    </LazyMotion>
  );
}
