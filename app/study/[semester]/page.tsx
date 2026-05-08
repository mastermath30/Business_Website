import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, FolderOpen } from "lucide-react";
import { Footer } from "@/components/Footer";
import { getPowerpointsBySemester } from "@/lib/db/seed";
import type { Semester } from "@/lib/db/schema";

// Cycling accent palette per lecture card — Tesla STEM brand colors.
const ACCENTS = [
  { bar: "#8dc63f", glow: "rgba(141, 198, 63, 0.4)" }, // tesla-green
  { bar: "#2563a8", glow: "rgba(37, 99, 168, 0.4)" }, // tesla-blue-mid
  { bar: "#5ba3d9", glow: "rgba(91, 163, 217, 0.4)" }, // light blue
  { bar: "#6fa832", glow: "rgba(111, 168, 50, 0.4)" }, // tesla-green-dim
  { bar: "#1a5fa8", glow: "rgba(26, 95, 168, 0.4)" }, // deep blue
] as const;

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
      {/* Sticky header — replaces the global Navbar on this page so the back
          button + semester title stay visible while the user scrolls the grid. */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md backdrop-saturate-150"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          borderColor: "rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link
            href="/study"
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              color: "#374151",
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All semesters
          </Link>
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "#6b7280" }}
            >
              0{semester}
            </span>
            <h2
              className="font-display text-base font-semibold tracking-tight"
              style={{ color: "#0a0a0a" }}
            >
              Semester {semester}
            </h2>
            <span
              className="hidden items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums sm:inline-flex"
              style={{
                background: "rgba(141, 198, 63, 0.1)",
                border: "1px solid rgba(141, 198, 63, 0.4)",
                color: "#6fa832",
              }}
            >
              {topics.length} topics
            </span>
          </div>
          <div className="w-[110px]" />
        </div>
      </header>

      <main
        className="relative min-h-screen pb-24 pt-12"
        style={{ background: "#ffffff" }}
      >

        <div className="container">
          <div className="mx-auto max-w-5xl">
            {/* Title block */}
            <div className="mt-2 max-w-2xl">
              <h1
                className="font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-balance md:text-5xl"
                style={{ color: "#0a0a0a" }}
              >
                Pick a topic
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #8dc63f 0%, #2563a8 100%)",
                  }}
                >
                  to study.
                </span>
              </h1>
              <p
                className="mt-4 max-w-xl text-sm md:text-[15px]"
                style={{ color: "#6b7280" }}
              >
                Each topic was extracted from a lecture deck. Open one to start
                a 10-question study round, or take the 50-question semester
                exam.
              </p>
            </div>

            {/* Topic grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((t, i) => {
                const accent = ACCENTS[i % ACCENTS.length];
                return (
                  <Link
                    key={t.id}
                    href={`/study/${semester}/${encodeURIComponent(t.id)}`}
                    className="group relative isolate flex flex-col overflow-hidden rounded-2xl border bg-[#f9fafb] transition-all duration-300 hover:-translate-y-1 border-[#e5e7eb] hover:border-[rgba(141,198,63,0.6)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                  >
                    {/* Top accent bar */}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-[3px] origin-left transition-transform duration-300 group-hover:scale-x-100"
                      style={{ background: accent.bar }}
                    />

                    <div className="relative flex flex-1 flex-col p-6">
                      <div className="flex items-start justify-between">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
                          style={{
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            color: "#6b7280",
                          }}
                        >
                          <FolderOpen className="h-4 w-4" />
                        </span>
                        <span
                          className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em]"
                          style={{ color: "#8dc63f" }}
                        >
                          Lecture {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3
                        className="mt-6 font-display text-lg font-semibold leading-snug tracking-tight md:text-xl"
                        style={{ color: "#0a0a0a" }}
                      >
                        {t.topic_name}
                      </h3>
                    </div>

                    {/* Bottom CTA — full-width pill */}
                    <div className="relative px-6 pb-6">
                      <span className="flex w-full items-center justify-center gap-2 rounded-full border border-[#8dc63f] bg-transparent px-4 py-2.5 text-xs font-semibold text-[#8dc63f] transition-all duration-300 group-hover:bg-[#8dc63f] group-hover:text-[#0f2338]">
                        Open
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
