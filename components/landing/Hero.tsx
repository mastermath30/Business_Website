"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { Magnetic } from "@/components/Magnetic";
import { TypingHeadline } from "./TypingHeadline";
import { SPRING_TAP } from "@/lib/animation";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const handleTypingDone = useCallback(() => {
    gsap.to("[data-hero-attribution]", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  // Scroll-linked parallax for the study preview.
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

      // attribution stays hidden — fades in after typing finishes via handleTypingDone
      gsap.set("[data-hero-attribution]", { opacity: 0, y: -10 });
      gsap.set("[data-hero-badge]", { opacity: 0, y: -10 });
      gsap.set("[data-hero-headline]", { opacity: 0, y: 24 });
      gsap.set("[data-hero-subtext]", { opacity: 0, y: 22 });
      gsap.set("[data-hero-cta]", { opacity: 0, y: 18 });
      gsap.set("[data-hero-mockup]", { opacity: 0, y: 60 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.25,
      });

      tl.to("[data-hero-badge]", { opacity: 1, y: 0, duration: 0.6 }, 0.1)
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
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-28 pb-16"
      style={{ background: "hsl(var(--background))", transform: "translateZ(0)" }}
    >
      <div className="container relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Tesla STEM attribution */}
          <div
            data-hero-attribution
            className="mb-3 inline-flex items-center gap-2.5 text-base"
            style={{ color: "hsl(var(--muted-foreground))", willChange: "transform, opacity", opacity: 0 }}
          >
            <img
              src="/TeslaSTEMlogo.png"
              alt="Tesla STEM High School"
              className="h-9 w-9 object-contain"
            />
            <span>Official study tool of Tesla STEM Pythons</span>
          </div>

          {/* announcement badge */}
          <div data-hero-badge className="mb-6 flex justify-center" style={{ willChange: "transform, opacity", opacity: 0 }}>
            <Link
              href="#features"
              className="group inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-base font-medium transition-colors"
              style={{
                color: "hsl(var(--foreground) / 0.75)",
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
            style={{ willChange: "transform, opacity", opacity: 0 }}
          >
            <TypingHeadline onDone={handleTypingDone} />
          </div>

          {/* subtext */}
          <p
            data-hero-subtext
            className="mt-6 max-w-xl text-balance text-lg"
            style={{ color: "hsl(var(--muted-foreground))", willChange: "transform, opacity", opacity: 0 }}
          >
            Your Tesla STEM business final is coming. Every lesson from both
            semesters is built in with quizzes so you can study and be ready.
          </p>

          {/* single CTA — magnetic + spring-scale on hover */}
          <div
            data-hero-cta
            className="mt-10"
            style={{ willChange: "transform, opacity", opacity: 0 }}
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

        {/* Floating study preview — parallax outer, GSAP entrance + breathing inner */}
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
            <HeroStudyPreview />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const QUIZ_OPTIONS = [
  { letter: "A", text: "Demand is inelastic and the product is highly differentiated" },
  { letter: "B", text: "The market is price-sensitive and the firm seeks rapid market share", correct: true },
  { letter: "C", text: "Switching costs are low and competitors are exiting" },
  { letter: "D", text: "Costs decline slowly and scale economies are weak" },
];

function HeroStudyPreview() {
  return (
    <div
      style={{
        transform: "rotateX(3deg) translateZ(0)",
        transformStyle: "preserve-3d",
        background: "linear-gradient(135deg, #0f1a12 0%, #0d1f17 55%, #0a1a1f 100%)",
        border: "1px solid rgba(22,163,74,0.30)",
        boxShadow:
          "0 30px 80px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.14), 0 0 60px rgba(22,163,74,0.08)",
      }}
      className="relative overflow-hidden rounded-[28px] p-6 md:p-10"
    >
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(22,163,74,0.20) 0%, transparent 70%)", filter: "blur(28px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 right-0 h-56 w-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)", filter: "blur(28px)" }}
      />

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Header bar */}
        <div
          className="mb-4 flex items-center gap-3 rounded-2xl px-4 py-2.5"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <span
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-bold"
            style={{
              background: "rgba(22,163,74,0.15)",
              border: "1px solid rgba(22,163,74,0.40)",
              color: "#16a34a",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "#16a34a", boxShadow: "0 0 6px rgba(22,163,74,0.9)" }}
            />
            Marketing · Q4 / 10
          </span>
          <div className="relative h-2 flex-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              initial={{ width: "20%" }}
              animate={{ width: "40%" }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 1 }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, #16a34a 0%, #22d3ee 100%)",
                boxShadow: "0 0 10px rgba(22,163,74,0.5)",
              }}
            />
          </div>
          <span className="font-mono text-[11px] font-bold tabular-nums" style={{ color: "rgba(255,255,255,0.50)" }}>
            4<span style={{ color: "rgba(255,255,255,0.25)" }}>/10</span>
          </span>
        </div>

        {/* Quiz card */}
        <div
          className="rounded-2xl p-6 md:p-8"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {/* Question number pill */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-bold"
            style={{
              background: "rgba(22,163,74,0.12)",
              border: "1px solid rgba(22,163,74,0.40)",
              color: "#16a34a",
            }}
          >
            Question 4 of 10
          </span>

          {/* Question text */}
          <h3 className="mt-4 mb-5 text-base font-semibold leading-snug text-white md:text-lg">
            A penetration pricing strategy is most appropriate when:
          </h3>

          {/* Answer options */}
          <ul className="space-y-2.5">
            {QUIZ_OPTIONS.map(({ letter, text, correct }, i) => (
              <motion.li
                key={letter}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border px-4 py-3 text-[13px] font-medium"
                style={
                  correct
                    ? {
                        borderColor: "rgba(22,163,74,0.60)",
                        background: "rgba(22,163,74,0.12)",
                        color: "#bbf7d0",
                      }
                    : {
                        borderColor: "rgba(255,255,255,0.09)",
                        background: "rgba(255,255,255,0.03)",
                        color: "rgba(255,255,255,0.42)",
                      }
                }
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                  style={
                    correct
                      ? { background: "#16a34a", color: "#fff" }
                      : { background: "rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.35)" }
                  }
                >
                  {letter}
                </span>
                <span className="flex-1 leading-snug">{text}</span>
                {correct && (
                  <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "#16a34a" }} />
                )}
              </motion.li>
            ))}
          </ul>

          {/* Next button */}
          <div
            className="mt-5 w-full rounded-xl py-3 text-center text-sm font-semibold text-white"
            style={{ background: "#16a34a", boxShadow: "0 4px 16px rgba(22,163,74,0.35)" }}
          >
            Next question →
          </div>
        </div>
      </div>
    </div>
  );
}
