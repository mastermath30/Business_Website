"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { powerpoints } from "@/lib/db/seed";
import { getSessions, relTime, type QuizSession } from "@/lib/localStorage";

export default function QuizzesPage() {
  const [sessions, setSessions] = useState<QuizSession[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  function sessionsFor(id: string) {
    return sessions.filter((s) => s.lessonKey === id);
  }
  function lastTaken(id: string): string | null {
    const ls = sessionsFor(id);
    if (ls.length === 0) return null;
    return ls.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )[0].completedAt;
  }

  return (
    <>
      <Topbar title="Quiz library" />
      <div className="px-4 py-8 md:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Quiz library
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {powerpoints.length} lessons · 50 questions each
            </p>
          </div>
          <Button asChild variant="primary" size="sm">
            <Link href="/study">
              <Sparkles className="h-4 w-4" />
              Open study tool
            </Link>
          </Button>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-background/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Lesson</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Semester</th>
                <th className="px-5 py-3 font-medium">Questions</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Sessions</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Last taken</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {powerpoints.map((lesson) => {
                const sc = sessionsFor(lesson.id).length;
                const lt = lastTaken(lesson.id);
                return (
                  <tr
                    key={lesson.id}
                    className="group border-b border-border/40 transition-colors last:border-b-0 hover:bg-accent/30"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium">{lesson.topic_name}</div>
                    </td>
                    <td className="hidden px-5 py-4 md:table-cell">
                      <span className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        Sem {lesson.semester}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                      50
                    </td>
                    <td className="hidden px-5 py-4 md:table-cell">
                      {sc > 0 ? (
                        <span className="rounded-full border border-success/20 bg-success/10 px-2 py-0.5 font-mono text-[10px] text-success">
                          {sc} completed
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Not started
                        </span>
                      )}
                    </td>
                    <td className="hidden px-5 py-4 text-xs text-muted-foreground md:table-cell">
                      {lt ? relTime(lt) : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button asChild size="sm" variant="ghost">
                        <Link
                          href={`/study/${lesson.semester}/${encodeURIComponent(lesson.id)}/quiz?mode=study`}
                        >
                          Start
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
