import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FolderOpen, GraduationCap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPowerpointsBySemester } from "@/lib/db/seed";
import { TypingText } from "@/components/TypingText";
import type { Semester } from "@/lib/db/schema";

// Semester-themed solid colors. Sem 1 = green, Sem 2 = blue. No gradients.
const THEME = {
  1: {
    base: "#16a34a",
    hover: "#15803d",
    hoverBorder: "rgba(22, 163, 74, 0.55)",
    glow: "rgba(22, 163, 74, 0.4)",
  },
  2: {
    base: "#1e40af",
    hover: "#1e3a8a",
    hoverBorder: "rgba(30, 64, 175, 0.55)",
    glow: "rgba(30, 64, 175, 0.4)",
  },
} as const;

export function generateStaticParams() {
  return [{ semester: "1" }, { semester: "2" }];
}

export default async function SemesterPage({
  params,
}: {
  params: Promise<{ semester: string }>;
}) {
  const { semester: raw } = await params;
  const semNum = Number(raw);
  if (semNum !== 1 && semNum !== 2) notFound();
  const semester = semNum as Semester;
  const topics = getPowerpointsBySemester(semester);

  return (
    <>
      <Navbar />
      {/* Spacer pushes content below the fixed Navbar (16px margin + 72px height = 88px) */}
      <div className="h-[88px]" />
      <main className="surface-base relative min-h-screen pb-24 pt-12">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="mt-2 max-w-2xl">
              <TypingText
                text="Pick a topic to study"
                className="font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-balance md:text-5xl bg-clip-text text-transparent pb-2"
                style={{ backgroundImage: "linear-gradient(135deg, #16a34a 0%, #22d3ee 100%)" }}
                cursorColor="#22d3ee"
              />
              <p className="text-soft mt-4 max-w-xl text-sm md:text-[15px]">
                Each topic was extracted from a lecture deck. Open one to start
                the lesson page.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 items-stretch gap-6">
              {topics.map((t, i) => {
                const theme = THEME[semester];
                const cardHoverBorder =
                  semester === 1
                    ? "hover:border-[rgba(22,163,74,0.55)]"
                    : "hover:border-[rgba(30,64,175,0.55)]";
                const buttonClasses =
                  semester === 1
                    ? "bg-[#16a34a] hover:bg-[#15803d]"
                    : "bg-[#1e40af] hover:bg-[#1e3a8a]";
                return (
                  <Link
                    key={t.id}
                    href={`/study/${semester}/${encodeURIComponent(t.id)}`}
                    className={`surface-card border-soft group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.12)] ${cardHoverBorder}`}
                  >
                    {/* Accent bar */}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-[3px]"
                      style={{ background: theme.base }}
                    />

                    <div className="flex flex-1 flex-col p-6">

                      {/* Zone 1 — icon + status badge, always at top */}
                      <div className="flex items-center justify-between">
                        <span className="text-soft border-soft surface-elevated flex h-9 w-9 items-center justify-center rounded-lg">
                          <FolderOpen className="h-4 w-4" />
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest"
                          style={{
                            background: `${theme.base}1a`,
                            border: `1px solid ${theme.base}40`,
                            color: theme.base,
                          }}
                        >
                          Not Started
                        </span>
                      </div>

                      {/* Zone 2 — title, hard-fixed 5rem, overflow clipped to 2 lines */}
                      <h3
                        className="text-strong mt-4 font-display text-lg font-semibold tracking-tight"
                        style={{
                          height: "5rem",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          lineHeight: "1.4",
                        }}
                      >
                        {t.topic_name}
                      </h3>

                      {/* Zone 3 — spacer, absorbs all remaining vertical space */}
                      <div className="flex-1" />

                      {/* Zone 4 — button, pinned to bottom */}
                      <span
                        className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-white transition-colors duration-200 ${buttonClasses}`}
                      >
                        View lesson
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>

                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Semester Exam — full-width card below all lesson cards */}
            <div className="mt-8">
              <Link
                href={`/study/${semester}/exam`}
                className="surface-card border-soft group relative isolate flex w-full items-center justify-between overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.12)]"
                style={{ borderLeft: `4px solid ${THEME[semester].base}` }}
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ background: THEME[semester].base }}
                />
                <div className="flex items-center gap-5">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                    style={{
                      background: THEME[semester].base,
                      boxShadow: `0 4px 14px ${THEME[semester].glow}`,
                    }}
                  >
                    <GraduationCap className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-strong font-display text-xl font-semibold tracking-tight">
                      Semester {semester} Final Exam
                    </h3>
                    <p className="text-soft mt-1 text-sm">
                      50 questions · Pulls from all {topics.length} topics · Timed
                    </p>
                  </div>
                </div>
                <span
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform group-hover:translate-x-0.5"
                  style={{ background: THEME[semester].base }}
                >
                  Start exam
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
