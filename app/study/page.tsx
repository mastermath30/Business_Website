import Link from "next/link";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPowerpointsBySemester } from "@/lib/db/seed";
import { TypingText } from "@/components/TypingText";

export const metadata = {
  title: "Study Tool",
};

// Solid color theming — Sem 1 = green, Sem 2 = blue. No gradients.
const semesters = [
  {
    n: 1,
    label: "Semester 1",
    blurb:
      "Foundations — business definition, SWOT, factors of production, market types, intro to micro & macro, marketing, pricing.",
    accentBar: "#16a34a",
    glow: "rgba(22, 163, 74, 0.45)",
    pillBg: "rgba(22, 163, 74, 0.10)",
    pillBorder: "rgba(22, 163, 74, 0.40)",
    pillText: "#16a34a",
    iconBg: "#16a34a",
    arrowText: "#ffffff",
  },
  {
    n: 2,
    label: "Semester 2",
    blurb:
      "Application — supply & demand, business model canvas, market segmentation, fiscal policy, IP, game theory, workplace etiquette.",
    accentBar: "#1e40af",
    glow: "rgba(30, 64, 175, 0.45)",
    pillBg: "rgba(30, 64, 175, 0.10)",
    pillBorder: "rgba(30, 64, 175, 0.40)",
    pillText: "#1e40af",
    iconBg: "#1e40af",
    arrowText: "#ffffff",
  },
] as const;

export default function StudyHomePage() {
  const counts = {
    1: getPowerpointsBySemester(1).length,
    2: getPowerpointsBySemester(2).length,
  };

  return (
    <>
      <Navbar />
      <main className="surface-base relative min-h-screen overflow-hidden pt-32 pb-24">
        <div className="container">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex flex-col items-center gap-2">
              <img
                src="/TeslaSTEMlogo.png"
                alt="Tesla STEM High School"
                className="h-12 w-12 object-contain"
              />
              <span className="text-soft text-xs">
                Nikola Tesla STEM High School
              </span>
            </div>
            <div
              className="text-mid inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                border: "1px solid rgba(22, 163, 74, 0.40)",
                background: "rgba(22, 163, 74, 0.08)",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: "#16a34a" }} />
              Study Tool · Tesla STEM
            </div>
            <TypingText
              text="Pick your semester to start studying."
              className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-[-0.02em] text-balance md:text-6xl bg-clip-text text-transparent pb-2"
              style={{ backgroundImage: "linear-gradient(135deg, #16a34a 0%, #22d3ee 100%)" }}
              cursorColor="#22d3ee"
            />
            <p className="text-soft mx-auto mt-5 max-w-xl text-balance text-base md:text-lg">
              Lecture decks are pre-loaded. Choose a semester to see every topic
              extracted from this term&apos;s PowerPoints.
            </p>
          </div>

          {/* Semester cards */}
          <div className="mx-auto mt-16 grid max-w-5xl gap-7 md:grid-cols-2">
            {semesters.map((s) => (
              <Link
                key={s.n}
                href={`/study/${s.n}`}
                className="surface-card group relative isolate flex min-h-[360px] flex-col overflow-hidden rounded-3xl border-soft p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)] md:min-h-[440px] md:p-10"
                style={{
                  borderLeftWidth: "4px",
                  borderLeftColor: s.accentBar,
                }}
              >
                <div className="relative flex h-full flex-col">
                  {/* Top: icon + count pill */}
                  <div className="flex items-start justify-between">
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                      style={{
                        background: s.iconBg,
                        boxShadow: `0 4px 14px ${s.glow}`,
                      }}
                    >
                      <Calendar className="h-6 w-6" />
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tabular-nums"
                      style={{
                        background: s.pillBg,
                        border: `1px solid ${s.pillBorder}`,
                        color: s.pillText,
                      }}
                    >
                      {counts[s.n as 1 | 2]} topics
                    </span>
                  </div>

                  {/* Middle: title + blurb */}
                  <div className="mt-auto pt-12">
                    <h2 className="text-strong font-display text-4xl font-bold tracking-tight md:text-5xl">
                      {s.label}
                    </h2>
                    <p className="text-mid mt-3 max-w-md text-sm leading-relaxed md:text-[15px]">
                      {s.blurb}
                    </p>
                  </div>

                  {/* Bottom: CTA row — clean inline, subtle top divider only */}
                  <div
                    className="mt-7 flex items-center justify-between pt-5"
                    style={{ borderTop: "1px solid hsl(var(--foreground) / 0.08)" }}
                  >
                    <span className="text-soft text-xs font-medium">
                      Browse topics
                    </span>
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-0.5"
                      style={{
                        background: s.accentBar,
                        color: s.arrowText,
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
