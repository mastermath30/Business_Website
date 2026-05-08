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
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          willChange: "transform, opacity",
        }}
      >
        {/* decorative ambient glow */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-64 w-[80%]"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(141, 198, 63, 0.18), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEW_OPTS}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-3xl font-semibold leading-[1.05] tracking-tight text-balance md:text-5xl"
          >
            <span style={{ color: "#0a0a0a" }}>Your next exam,</span>{" "}
            <span className="text-gradient-brand">already studied.</span>
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
            style={{ color: "#6b7280" }}
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
            className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Magnetic strength={0.35}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING_TAP}
                className="inline-block"
              >
                <Link
                  href="/study"
                  className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold transition-colors duration-200"
                  style={{
                    background: "#8dc63f",
                    color: "#0f2338",
                    boxShadow: "0 0 24px rgba(141, 198, 63, 0.3)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#6fa832")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#8dc63f")
                  }
                >
                  <Sparkles className="h-4 w-4" />
                  Start studying free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </Magnetic>
            <Magnetic strength={0.25}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING_TAP}
                className="inline-block"
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-medium transition-colors"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    color: "#374151",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(141, 198, 63, 0.6)";
                    e.currentTarget.style.color = "#0a0a0a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.color = "#374151";
                  }}
                >
                  Browse the dashboard
                </Link>
              </motion.div>
            </Magnetic>
          </motion.div>
          <div className="mt-5 text-xs" style={{ color: "#6b7280" }}>
            Free for students · No setup · Built for Tesla STEM
          </div>
        </div>
      </motion.div>
    </section>
  );
}
