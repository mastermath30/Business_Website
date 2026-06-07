import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import { TypingText } from "@/components/TypingText";
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
  const totalBank = getAllQuestionsForPowerpoint(topic.id).length;

  return (
    <>
      <header className="header-glass sticky top-0 z-40 backdrop-saturate-150">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link
            href={`/study/${semester}`}
            className="text-mid border-soft surface-card inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Semester {semester}
          </Link>
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "#16a34a" }}
            >
              Topic
            </span>
            <h2 className="text-strong hidden font-display text-base font-semibold tracking-tight sm:block">
              Sem {semester}
            </h2>
          </div>
          <div className="w-[110px]" />
        </div>
      </header>

      <main className="surface-base relative min-h-screen pt-12 pb-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="mt-2">
              <TypingText
                text={topic.topic_name}
                className="font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-balance md:text-5xl bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #16a34a 0%, #22d3ee 100%)" }}
                cursorColor="#22d3ee"
              />
            </div>

            {totalBank > 0 ? (
              <div className="mt-10">
                <Link
                  href={`/study/${semester}/${encodeURIComponent(topic.id)}/quiz?mode=study`}
                  className="surface-card border-soft group relative isolate flex w-full items-center justify-between overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.12)]"
                  style={{ borderLeft: "4px solid #16a34a" }}
                >
                  <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: "#16a34a" }} />
                  <div className="flex items-center gap-5">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                      style={{ background: "#16a34a", boxShadow: "0 4px 14px rgba(22,163,74,0.4)" }}
                    >
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-strong font-display text-xl font-semibold tracking-tight">Study</h3>
                      <p className="text-soft mt-1 text-sm">
                        10 MCQs per session · {totalBank}-question pool · Retake for a fresh set
                      </p>
                    </div>
                  </div>
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform group-hover:translate-x-0.5"
                    style={{ background: "#16a34a" }}
                  >
                    Start
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            ) : (
              <div
                className="surface-card border-soft mt-10 rounded-2xl p-6"
                style={{ borderLeft: "4px solid #16a34a" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                    style={{
                      background: "#16a34a",
                      boxShadow: "0 4px 14px rgba(22, 163, 74, 0.4)",
                    }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-strong font-display text-xl font-semibold tracking-tight">
                      No questions available
                    </h3>
                    <p className="text-soft mt-1 text-sm">
                      This lesson is listed, but its quiz bank is empty.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

