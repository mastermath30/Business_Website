import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import {
  getAllQuestionsForPowerpoint,
  getPowerpointById,
  getPowerpointsBySemester,
} from "@/lib/db/seed";
import type { Semester } from "@/lib/db/schema";

export async function generateStaticParams() {
  return [1, 2].flatMap((sem) =>
    getPowerpointsBySemester(sem as Semester).map((pp) => ({
      semester: String(sem),
      topic: pp.id,
    }))
  );
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ semester: string; topic: string }>;
}) {
  const { semester: rawSem, topic: rawTopic } = await params;
  const semNum = Number(rawSem);
  if (semNum !== 1 && semNum !== 2) notFound();
  const topicId = decodeURIComponent(rawTopic);
  const topic = getPowerpointById(topicId);
  if (!topic || topic.semester !== semNum) notFound();
  const semester = semNum as Semester;
  const examPool = getPowerpointsBySemester(semester).length;
  const totalBank = getAllQuestionsForPowerpoint(topic.id).length;

  return (
    <>
      {/* Sticky header — Tesla-themed */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md backdrop-saturate-150"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          borderColor: "rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link
            href={`/study/${semester}`}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              color: "#374151",
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Semester {semester}
          </Link>
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "#8dc63f" }}
            >
              Topic
            </span>
            <h2
              className="hidden font-display text-base font-semibold tracking-tight sm:block"
              style={{ color: "#0a0a0a" }}
            >
              Sem {semester}
            </h2>
          </div>
          <div className="w-[110px]" />
        </div>
      </header>

      <main
        className="relative min-h-screen pt-12 pb-24"
        style={{ background: "#ffffff" }}
      >

        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="mt-2">
              <h1
                className="font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-balance md:text-5xl"
                style={{ color: "#0a0a0a" }}
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #8dc63f 0%, #2563a8 100%)",
                  }}
                >
                  {topic.topic_name}
                </span>
              </h1>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <ModeCard
                title="Study"
                count={totalBank}
                badge={`10 of ${totalBank} · Rotates`}
                blurb={`10 sharp MCQs each session, drawn from the ${totalBank}-question pool for this topic. Retake for a fresh set.`}
                icon={<Sparkles className="h-5 w-5" />}
                accentBar="#8dc63f"
                iconBg="linear-gradient(135deg, #8dc63f, #6fa832)"
                glow="rgba(141, 198, 63, 0.4)"
                href={`/study/${semester}/${encodeURIComponent(topic.id)}/quiz?mode=study`}
                hint="No timer · Spaced practice"
              />
              <ModeCard
                title="Final Exam"
                count={50}
                badge="50 Questions · Timed"
                blurb={`Pulls from all ${examPool} topics in semester ${semester}. Timed, with a full score summary at the end.`}
                icon={<GraduationCap className="h-5 w-5" />}
                accentBar="#2563a8"
                iconBg="linear-gradient(135deg, #2563a8, #5ba3d9)"
                glow="rgba(37, 99, 168, 0.4)"
                href={`/study/${semester}/${encodeURIComponent(topic.id)}/quiz?mode=exam`}
                hint="50 min · Score at end"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ModeCard({
  title,
  badge,
  blurb,
  icon,
  accentBar,
  iconBg,
  glow,
  href,
  hint,
  count,
}: {
  title: string;
  badge: string;
  blurb: string;
  icon: React.ReactNode;
  accentBar: string;
  iconBg: string;
  glow: string;
  href: string;
  hint: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      style={{
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderLeft: `4px solid ${accentBar}`,
      }}
    >
      <div className="relative">
        <div className="flex items-center justify-between">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
            style={{
              background: iconBg,
              boxShadow: `0 4px 14px ${glow}`,
            }}
          >
            {icon}
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
            style={{
              background: `${accentBar}14`,
              border: `1px solid ${accentBar}`,
              color: accentBar,
            }}
          >
            {badge}
          </span>
        </div>
        <h3
          className="mt-6 font-display text-2xl font-semibold tracking-tight"
          style={{ color: "#0a0a0a" }}
        >
          {title}
        </h3>
        <p className="mt-2 text-sm" style={{ color: "#6b7280" }}>
          {blurb}
        </p>
        <div className="mt-6 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 text-[11px]"
            style={{ color: "#6b7280" }}
          >
            <Clock className="h-3 w-3" />
            {hint}
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-transform group-hover:translate-x-0.5"
            style={{
              background: "#8dc63f",
              color: "#0f2338",
            }}
          >
            Start
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="sr-only">{count} questions</div>
      </div>
    </Link>
  );
}
