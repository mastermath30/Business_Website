"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Target,
  Brain,
  BookOpen,
  Zap,
  CircleUserRound,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TypingText } from "@/components/TypingText";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Stat = { value: number; label: string; suffix?: string };
type Milestone = { tag: string; body: string };
type Principle = {
  title: string;
  description: string;
  gradient: string;
  icon: LucideIcon;
};
type Member = {
  name: string;
  role: string;
  desc: string;
  school: string;
  photo: string;
  gradient: string;
};

const stats: Stat[] = [
  { value: 2, label: "Semesters covered" },
  { value: 26, label: "Topics loaded", suffix: "+" },
  { value: 376, label: "Practice questions" },
  { value: 10, label: "Questions per round" },
];

const storyParas = [
  "Business class at Tesla STEM covers a lot of ground. The lectures are thorough, but reviewing slides the night before an exam rarely leads to real retention.",
  "Every topic extracted from every semester PowerPoint — turned into focused 10-question rounds so you know exactly what sticks and what doesn't.",
];

const pullQuote = "BusinessBoost was built to close that gap.";

const milestones: Milestone[] = [
  { tag: "The problem", body: "Reviewing slides the night before doesn't work." },
  { tag: "The solution", body: "Every lecture extracted into 10-question rounds." },
  { tag: "The result", body: "Instant feedback on what you know and don't." },
];

const principles: Principle[] = [
  {
    title: "Built for one purpose",
    description:
      "Converts Tesla STEM lecture decks into targeted, quiz-based practice.",
    gradient: "bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600",
    icon: Target,
  },
  {
    title: "Active recall over passive review",
    description:
      "Reading slides doesn't work. Testing yourself does. Every topic drops you straight into a quiz.",
    gradient: "bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-600",
    icon: Brain,
  },
  {
    title: "Grounded in real curriculum",
    description:
      "Every question comes from the actual PowerPoints taught in class.",
    gradient: "bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600",
    icon: BookOpen,
  },
  {
    title: "Fast by design",
    description:
      "No account needed. Open a topic, start a round, get your score.",
    gradient: "bg-gradient-to-br from-green-400 via-emerald-500 to-cyan-600",
    icon: Zap,
  },
];

const team: Member[] = [
  {
    name: "Malhar Pawar",
    role: "HEAD DEVELOPER",
    desc: "Architected and built BusinessBoost end to end.",
    school: "Tesla STEM High School · Class of 2028",
    photo: "/images/team/malhar.jpeg",
    gradient: "bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600",
  },
  {
    name: "Koji Hamanaka",
    role: "CO-DEVELOPER",
    desc: "Built the core quiz and study systems.",
    school: "Tesla STEM High School · Class of 2026",
    photo: "",
    gradient: "bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-600",
  },
  {
    name: "Aarushi Bhatia",
    role: "UI/UX DESIGNER",
    desc: "Designed the product from the ground up.",
    school: "Tesla STEM High School · Class of 2026",
    photo: "/images/team/aarushi.jpeg",
    gradient: "bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600",
  },
  {
    name: "Nethaniah Gashaw",
    role: "UI/UX DESIGNER",
    desc: "Crafted every interaction and user flow.",
    school: "Tesla STEM High School · Class of 2027",
    photo: "/images/team/nethaniah.jpeg",
    gradient: "bg-gradient-to-br from-green-400 via-emerald-500 to-cyan-600",
  },
];

function NumberTicker({
  value,
  suffix,
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(motionValue, (v) =>
    Math.round(v).toLocaleString()
  );

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      motionValue.jump(value);
    } else {
      motionValue.set(value);
    }
  }, [inView, value, motionValue, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

export default function AboutPage() {
  const reduce = useReducedMotion();

  const fadeUp: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: EASE },
        },
      };

  const stagger: Variants = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
      };

  const { scrollYProgress } = useScroll();
  const blobY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <>
      <Navbar />
      <div className="h-[88px]" />

      <main className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white">
        {/* ─── SECTION 1 — HERO ──────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden py-16 md:py-20 lg:py-24">
          <motion.div
            aria-hidden
            style={{ y: reduce ? 0 : blobY }}
            className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-200/40 via-teal-200/30 to-cyan-200/40 blur-3xl dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20"
          />
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative mx-auto max-w-5xl px-6 text-center"
          >
            <motion.p
              variants={fadeUp}
              className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400"
            >
              About BusinessBoost
            </motion.p>
            <TypingText
              text="Helping Pythons ace their business final"
              className="font-display text-5xl font-extrabold leading-[1.05] tracking-[-0.02em] text-balance md:text-6xl bg-clip-text text-transparent pb-2"
              style={{ backgroundImage: "linear-gradient(135deg, #16a34a 0%, #22d3ee 100%)" }}
              cursorColor="#22d3ee"
            />
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-xl"
            >
              Built for the way students actually study.
            </motion.p>
          </motion.div>
        </section>

        {/* ─── SECTION 2 — STATS BAR ─────────────────────────────────── */}
        <section className="w-full py-12 md:py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4 md:gap-12 lg:px-8"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="text-center"
              >
                <div className="text-5xl font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-white md:text-6xl">
                  <NumberTicker value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── SECTION 3 — OUR STORY ─────────────────────────────────── */}
        <section className="w-full py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
            {/* Left — sticky */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start"
            >
              <motion.p
                variants={fadeUp}
                className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400"
              >
                Our Story
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-900 dark:text-white md:text-5xl lg:text-6xl"
              >
                We built what we wished existed.
              </motion.h2>
            </motion.div>

            {/* Right — prose + pull-quote */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="lg:col-span-7"
            >
              <motion.div
                variants={fadeUp}
                className="max-w-2xl space-y-6 text-lg leading-[1.7] text-zinc-600 dark:text-zinc-300 md:text-xl"
              >
                <p>{storyParas[0]}</p>
                <p>{storyParas[1]}</p>
              </motion.div>
              <motion.blockquote
                variants={fadeUp}
                className="my-12 border-l-2 border-emerald-500 pl-6 text-2xl font-medium leading-snug tracking-tight text-zinc-900 dark:text-white md:text-3xl"
              >
                {pullQuote}
              </motion.blockquote>

              {/* Milestone timeline */}
              <motion.ol
                variants={stagger}
                className="relative space-y-8 border-l-2 border-emerald-500/20 pl-8"
              >
                {milestones.map((m) => (
                  <motion.li key={m.tag} variants={fadeUp} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-zinc-950"
                    >
                      <span className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15" />
                    </span>
                    <div className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                      {m.tag}
                    </div>
                    <p className="mt-2 text-lg font-medium tracking-tight text-zinc-900 dark:text-white">
                      {m.body}
                    </p>
                  </motion.li>
                ))}
              </motion.ol>
            </motion.div>
          </div>
        </section>

        {/* ─── SECTION 4 — WHAT WE BELIEVE ───────────────────────────── */}
        <section className="w-full bg-zinc-50 py-24 dark:bg-white/[0.02] md:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.p
                variants={fadeUp}
                className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400"
              >
                Principles
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-900 dark:text-white md:text-5xl lg:text-6xl"
              >
                What we believe
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
            >
              {principles.map((p) => {
                const Icon = p.icon;
                return (
                  <motion.article
                    key={p.title}
                    variants={fadeUp}
                    whileHover={reduce ? undefined : { y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div
                      aria-hidden
                      className={`relative aspect-[4/5] w-full overflow-hidden ${p.gradient}`}
                    >
                      <motion.div
                        whileHover={reduce ? undefined : { scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Icon
                          className="size-20 text-white/90 drop-shadow-md"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      </motion.div>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                        {p.title}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                        {p.description}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ─── SECTION 5 — MEET THE TEAM ─────────────────────────────── */}
        <section className="w-full py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.p
                variants={fadeUp}
                className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400"
              >
                The people
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-900 dark:text-white md:text-5xl lg:text-6xl"
              >
                Meet the team
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-md text-lg leading-relaxed text-zinc-600 dark:text-zinc-300"
              >
                Four Tesla STEM students who built BusinessBoost from scratch.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
            >
              {team.map((m) => (
                <motion.article
                  key={m.name}
                  variants={fadeUp}
                  whileHover={reduce ? undefined : { y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div
                    className={`relative aspect-[4/5] w-full overflow-hidden ${m.gradient}`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center">
                      <CircleUserRound
                        className="size-20 text-white/40"
                        strokeWidth={1.25}
                        aria-hidden
                      />
                    </span>
                    {m.photo && (
                      <Image
                        src={m.photo}
                        alt={m.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-top"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      {m.role}
                    </div>
                    <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                      {m.name}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {m.desc}
                    </p>
                    <div className="mt-4 text-[11px] font-medium text-zinc-500 dark:text-zinc-500">
                      {m.school}
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── SECTION 6 — BOTTOM CTA ────────────────────────────────── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="w-full px-6 py-14 md:py-20"
        >
          <motion.div
            variants={fadeUp}
            className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 px-8 py-20 text-center shadow-xl md:py-28"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.25),transparent_60%)]"
            />
            <h2 className="relative text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
              Ready to actually learn this?
            </h2>
            <p className="relative mx-auto mt-6 max-w-2xl text-lg text-white/85 md:text-xl">
              Open any topic and start a 10-question round. No setup. No account required.
            </p>
            <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/study"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-medium text-zinc-900 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-600"
              >
                Start studying <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/study"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-7 py-3.5 text-base font-medium text-white ring-1 ring-inset ring-white/30 backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Browse topics
              </Link>
            </div>
          </motion.div>
        </motion.section>
      </main>

      <Footer />
    </>
  );
}
