"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { ThemeProvider } from "./ThemeProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LazyMotion features={domAnimation}>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </LazyMotion>
    </ThemeProvider>
  );
}
