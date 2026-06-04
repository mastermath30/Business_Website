"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Magnetic } from "@/components/Magnetic";
import { SPRING_TAP, VIEW_OPTS } from "@/lib/animation";

export function CTA() {
  return (
    <section className="container relative mt-32">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEW_OPTS}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl p-10 md:p-16"
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--surface-border)",
          willChange: "transform, opacity",
        }}
      >
        {/* subtle top accent line */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "rgba(22, 163, 74, 0.3)" }}
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEW_OPTS}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-3xl font-semibold leading-[1.05] tracking-tight text-balance md:text-5xl"
          >
            <span className="text-foreground">Your next exam,</span>{" "}
            <span style={{ color: "#16a34a" }}>already studied.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEW_OPTS}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-4 max-w-md text-balance"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Pick a semester, pick a topic, run 10 sharp MCQs. Then come back
            for another fresh set tomorrow.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEW_OPTS}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
          >
            <Magnetic strength={0.15}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING_TAP}
                className="inline-block"
              >
                <Link href="/study" className="btn-primary group px-7 py-3 text-base">
                  <Sparkles className="h-4 w-4" />
                  Start studying free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </Magnetic>
            <Magnetic strength={0.12}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING_TAP}
                className="inline-block"
              >
                <Link href="/study" className="btn-ghost px-6 py-3 text-base">
                  Browse study topics
                </Link>
              </motion.div>
            </Magnetic>
          </motion.div>
          <div className="mt-5 text-xs text-muted-foreground">
            Free for students · No setup · Built for Tesla STEM
          </div>
        </div>
      </motion.div>
    </section>
  );
}
