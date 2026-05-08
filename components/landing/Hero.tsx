"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { Magnetic } from "@/components/Magnetic";
import { CountUp } from "@/components/CountUp";
import { TypingHeadline } from "./TypingHeadline";
import { SPRING_TAP } from "@/lib/animation";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked parallax for the dashboard mockup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const mockupParallaxY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const mockupParallaxOpacity = useTransform(
    scrollYProgress,
    [0, 0.55, 0.9],
    [1, 1, 0.45]
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const allTargets = [
        "[data-hero-attribution]",
        "[data-hero-badge]",
        "[data-hero-headline]",
        "[data-hero-subtext]",
        "[data-hero-cta]",
        "[data-hero-mockup]",
      ];

      if (reduceMotion) {
        gsap.set(allTargets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set("[data-hero-attribution]", { opacity: 0, y: -10 });
      gsap.set("[data-hero-badge]", { opacity: 0, y: -10 });
      gsap.set("[data-hero-headline]", { opacity: 0, y: 24 });
      gsap.set("[data-hero-subtext]", { opacity: 0, y: 22 });
      gsap.set("[data-hero-cta]", { opacity: 0, y: 18 });
      gsap.set("[data-hero-mockup]", { opacity: 0, y: 60 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.15,
      });

      tl.to(
        "[data-hero-attribution]",
        { opacity: 1, y: 0, duration: 0.6 },
        0
      )
        .to("[data-hero-badge]", { opacity: 1, y: 0, duration: 0.6 }, 0.1)
        .to(
          "[data-hero-headline]",
          { opacity: 1, y: 0, duration: 0.7 },
          0.25
        )
        .to(
          "[data-hero-subtext]",
          { opacity: 1, y: 0, duration: 0.7 },
          1.45
        )
        .to(
          "[data-hero-cta]",
          { opacity: 1, y: 0, duration: 0.7 },
          1.6
        )
        .to(
          "[data-hero-mockup]",
          { opacity: 1, y: 0, duration: 1.0 },
          1.75
        )
        .to(
          "[data-hero-mockup]",
          {
            y: -6,
            duration: 3.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          },
          ">"
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-8 pb-16"
      style={{ background: "#ffffff", transform: "translateZ(0)" }}
    >
      <div className="container relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Tesla STEM attribution */}
          <div
            data-hero-attribution
            className="mb-3 inline-flex items-center gap-2.5 text-base"
            style={{ color: "#6b7280", willChange: "transform, opacity" }}
          >
            <img
              src="/TeslaSTEMlogo.png"
              alt="Tesla STEM High School"
              className="h-9 w-9 object-contain"
            />
            <span>Official study tool of Tesla STEM Pythons</span>
          </div>

          {/* announcement badge */}
          <div data-hero-badge className="mb-6 flex justify-center" style={{ willChange: "transform, opacity" }}>
            <Link
              href="#features"
              className="group inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-base font-medium transition-colors"
              style={{
                color: "#374151",
                border: "1px solid rgba(141, 198, 63, 0.4)",
                background: "rgba(141, 198, 63, 0.08)",
              }}
            >
              <span className="relative inline-flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                  style={{ background: "#8dc63f" }}
                />
                <span
                  className="relative inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ background: "#8dc63f" }}
                />
              </span>
              Built for Tesla STEM business students
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* headline — typing animation in place of the static H1 */}
          <div
            data-hero-headline
            className="mt-7"
            style={{ willChange: "transform, opacity" }}
          >
            <TypingHeadline />
          </div>

          {/* subtext */}
          <p
            data-hero-subtext
            className="mt-6 max-w-xl text-balance text-lg"
            style={{ color: "#6b7280", willChange: "transform, opacity" }}
          >
            Every Tesla STEM business lecture, turned into 25 exam-grade MCQs
            per topic. Pick a semester, pick a topic, run a 10-question round —
            and come back tomorrow for a fresh set.
          </p>

          {/* single CTA — magnetic + spring-scale on hover */}
          <div
            data-hero-cta
            className="mt-10"
            style={{ willChange: "transform, opacity" }}
          >
            <Magnetic strength={0.4}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING_TAP}
                className="inline-block"
              >
                <Link
                  href="/study"
                  className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold transition-colors duration-200"
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
          </div>
        </div>

        {/* Floating dashboard preview — parallax outer, GSAP entrance + breathing inner */}
        <motion.div
          style={{
            y: mockupParallaxY,
            opacity: mockupParallaxOpacity,
          }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div
            data-hero-mockup
            style={{
              perspective: "1400px",
              willChange: "transform, opacity",
              opacity: 0,
            }}
          >
            <HeroDashboardMockup />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroDashboardMockup() {
  return (
    <div
      style={{
        transform: "rotateX(3deg) translateZ(0)",
        transformStyle: "preserve-3d",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow:
          "0 30px 60px rgba(0, 0, 0, 0.10), 0 4px 16px rgba(0, 0, 0, 0.05)",
      }}
      className="relative rounded-[28px] p-2"
    >
      <div
        className="overflow-hidden rounded-[20px]"
        style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
      >
        {/* window chrome */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div
            className="hidden items-center gap-1.5 rounded-full px-3 py-1 text-[11px] sm:flex"
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              color: "#6b7280",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "#8dc63f" }}
            />
            app.businessboost.com/dashboard
          </div>
          <div className="h-5 w-12" />
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-12 md:p-6">
          {/* sidebar mini */}
          <div className="hidden md:col-span-3 md:block">
            <div
              className="rounded-xl p-3"
              style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}
            >
              <div
                className="text-[10px] font-medium uppercase tracking-wider"
                style={{ color: "#6b7280" }}
              >
                Topics
              </div>
              <ul className="mt-3 space-y-1.5">
                {[
                  { label: "Marketing Strategy", active: true, p: 78 },
                  { label: "Financial Accounting", p: 42 },
                  { label: "Operations Mgmt", p: 92 },
                  { label: "Org Behavior", p: 56 },
                  { label: "Microeconomics", p: 18 },
                ].map((t) => (
                  <li
                    key={t.label}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-[11px]"
                    style={
                      t.active
                        ? {
                            background: "rgba(141, 198, 63, 0.12)",
                            color: "#6fa832",
                          }
                        : { color: "#6b7280" }
                    }
                  >
                    <span className="truncate">{t.label}</span>
                    <span>
                      <CountUp value={t.p} duration={1.4} delay={1.6} />%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* center: quiz card */}
          <div className="md:col-span-6">
            <div
              className="rounded-xl p-5"
              style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[10px]"
                  style={{
                    background: "rgba(141, 198, 63, 0.1)",
                    border: "1px solid rgba(141, 198, 63, 0.4)",
                    color: "#6fa832",
                  }}
                >
                  Marketing · Q4 / 10
                </div>
                <div className="text-[11px]" style={{ color: "#6b7280" }}>
                  00:24
                </div>
              </div>
              <div
                className="mt-2.5 h-1 overflow-hidden rounded-full"
                style={{ background: "#e5e7eb" }}
              >
                <motion.div
                  initial={{ width: "20%" }}
                  animate={{ width: "40%" }}
                  transition={{ duration: 1.4, ease: "easeOut", delay: 1 }}
                  className="h-full"
                  style={{
                    background: "linear-gradient(90deg, #8dc63f, #2563a8)",
                  }}
                />
              </div>
              <h3
                className="mt-5 text-[15px] font-medium leading-snug"
                style={{ color: "#0a0a0a" }}
              >
                A penetration pricing strategy is most appropriate when:
              </h3>
              <ul className="mt-3.5 space-y-2">
                {[
                  "Demand is inelastic and the product is highly differentiated",
                  "The market is price-sensitive and the firm seeks rapid market share",
                  "Switching costs are low and competitors are exiting",
                  "Costs decline slowly and scale economies are weak",
                ].map((opt, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 + i * 0.07 }}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-[12px]"
                    style={
                      i === 1
                        ? {
                            background: "#f0fdf4",
                            border: "1px solid #8dc63f",
                            color: "#0a0a0a",
                          }
                        : {
                            background: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            color: "#374151",
                          }
                    }
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-medium"
                        style={
                          i === 1
                            ? {
                                background: "rgba(141, 198, 63, 0.22)",
                                color: "#6fa832",
                              }
                            : { background: "#e5e7eb", color: "#6b7280" }
                        }
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </span>
                    {i === 1 && (
                      <CheckCircle2
                        className="h-3.5 w-3.5"
                        style={{ color: "#8dc63f" }}
                      />
                    )}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* right: stats */}
          <div className="grid grid-cols-2 gap-3 md:col-span-3 md:grid-cols-1">
            <div
              className="rounded-xl p-3.5"
              style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}
            >
              <div
                className="text-[10px] uppercase tracking-wider"
                style={{ color: "#6b7280" }}
              >
                Streak
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span
                  className="font-display text-2xl font-semibold tabular-nums"
                  style={{ color: "#0a0a0a" }}
                >
                  <CountUp value={12} duration={1.4} delay={1.6} />
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: "#6b7280" }}
                >
                  days
                </span>
              </div>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 flex-1 rounded-full"
                    style={
                      i < 5
                        ? {
                            background:
                              "linear-gradient(90deg, #8dc63f, #2563a8)",
                          }
                        : { background: "#e5e7eb" }
                    }
                  />
                ))}
              </div>
            </div>
            <div
              className="rounded-xl p-3.5"
              style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}
            >
              <div
                className="text-[10px] uppercase tracking-wider"
                style={{ color: "#6b7280" }}
              >
                XP
              </div>
              <div
                className="mt-1 font-display text-2xl font-semibold tabular-nums bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #8dc63f, #2563a8)",
                }}
              >
                <CountUp
                  value={4820}
                  duration={2.2}
                  delay={1.8}
                  format={(n) => n.toLocaleString()}
                />
              </div>
              <div
                className="mt-2 h-1 overflow-hidden rounded-full"
                style={{ background: "#e5e7eb" }}
              >
                <div
                  className="h-full w-[68%]"
                  style={{
                    background: "linear-gradient(90deg, #8dc63f, #2563a8)",
                  }}
                />
              </div>
              <div
                className="mt-1 text-[10px]"
                style={{ color: "#6b7280" }}
              >
                Lvl 14 · 180 to next
              </div>
            </div>
            <div
              className="col-span-2 rounded-xl p-3.5 md:col-span-1"
              style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}
            >
              <div
                className="text-[10px] uppercase tracking-wider"
                style={{ color: "#6b7280" }}
              >
                Accuracy
              </div>
              <div
                className="mt-1 font-display text-2xl font-semibold tabular-nums"
                style={{ color: "#0a0a0a" }}
              >
                <CountUp value={87} duration={1.6} delay={2.0} />
                <span className="text-sm" style={{ color: "#6b7280" }}>
                  %
                </span>
              </div>
              <div className="mt-2 flex h-7 items-end gap-1">
                {[40, 55, 32, 70, 60, 82, 87].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      background:
                        "linear-gradient(180deg, #8dc63f, #2563a8)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
