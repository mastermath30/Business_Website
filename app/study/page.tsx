import Link from "next/link";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPowerpointsBySemester } from "@/lib/db/seed";

export const metadata = {
  title: "Study Tool",
};

const semesters = [
  {
    n: 1,
    label: "Semester 1",
    blurb:
      "Foundations — business definition, SWOT, factors of production, market types, intro to micro & macro, marketing, pricing.",
    accent: "linear-gradient(135deg, #8dc63f, #6fa832)",
    accentBar: "#8dc63f",
    glow: "rgba(141, 198, 63, 0.45)",
    pillBg: "rgba(141, 198, 63, 0.1)",
    pillBorder: "rgba(141, 198, 63, 0.4)",
    pillText: "#8dc63f",
    iconBg: "linear-gradient(135deg, #8dc63f, #2563a8)",
    arrowText: "#0f2338",
  },
  {
    n: 2,
    label: "Semester 2",
    blurb:
      "Application — supply & demand, business model canvas, market segmentation, fiscal policy, IP, game theory, workplace etiquette.",
    accent: "linear-gradient(135deg, #2563a8, #1a5fa8)",
    accentBar: "#2563a8",
    glow: "rgba(37, 99, 168, 0.45)",
    pillBg: "rgba(37, 99, 168, 0.1)",
    pillBorder: "rgba(91, 163, 217, 0.4)",
    pillText: "#5ba3d9",
    iconBg: "linear-gradient(135deg, #2563a8, #5ba3d9)",
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
      <main className="relative min-h-screen overflow-hidden pt-32 pb-24" style={{ background: "#ffffff" }}>

        <div className="container">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            {/* Tesla STEM attribution above the badge */}
            <div className="mb-6 flex flex-col items-center gap-2">
              <img
                src="/TeslaSTEMlogo.png"
                alt="Tesla STEM High School"
                className="h-12 w-12 object-contain"
              />
              <span className="text-xs" style={{ color: "#6b7280" }}>
                Nikola Tesla STEM High School
              </span>
            </div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                color: "#374151",
                border: "1px solid rgba(141, 198, 63, 0.4)",
                background: "rgba(141, 198, 63, 0.08)",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: "#8dc63f" }} />
              Study Tool · Tesla STEM
            </div>
            <h1
              className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-[-0.02em] text-balance md:text-6xl"
              style={{ color: "#0a0a0a" }}
            >
              Pick your semester
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #8dc63f 0%, #2563a8 100%)",
                }}
              >
                to start studying.
              </span>
            </h1>
            <p
              className="mx-auto mt-5 max-w-xl text-balance text-base md:text-lg"
              style={{ color: "#6b7280" }}
            >
              Lecture decks are pre-loaded. Choose a semester to see every topic
              extracted from this term's PowerPoints.
            </p>
          </div>

          {/* Semester cards */}
          <div className="mx-auto mt-16 grid max-w-5xl gap-7 md:grid-cols-2">
            {semesters.map((s) => (
              <Link
                key={s.n}
                href={`/study/${s.n}`}
                className="group relative isolate flex min-h-[360px] flex-col overflow-hidden rounded-3xl border bg-[#f9fafb] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-[#e5e7eb] hover:border-[rgba(141,198,63,0.6)] md:min-h-[440px] md:p-10"
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
                        boxShadow: "0 4px 14px rgba(141, 198, 63, 0.25)",
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
                    <div
                      className="font-mono text-[11px] uppercase tracking-[0.22em]"
                      style={{ color: "#6b7280" }}
                    >
                      0{s.n}
                    </div>
                    <h2
                      className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl"
                      style={{ color: "#0a0a0a" }}
                    >
                      {s.label}
                    </h2>
                    <p
                      className="mt-3 max-w-md text-sm leading-relaxed md:text-[15px]"
                      style={{ color: "#374151" }}
                    >
                      {s.blurb}
                    </p>
                  </div>

                  {/* Bottom: CTA row */}
                  <div
                    className="mt-7 flex items-center justify-between border-t pt-5"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: "#6b7280" }}
                    >
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
