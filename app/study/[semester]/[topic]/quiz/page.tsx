import { notFound } from "next/navigation";
import { StudyQuizRunner } from "@/components/study/StudyQuizRunner";
import {
  getAllQuestionsForPowerpoint,
  getExamQuestionsForSemester,
  getPowerpointById,
} from "@/lib/db/seed";
import type { QuizMode, Semester } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function StudyQuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ semester: string; topic: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const [{ semester: rawSem, topic: rawTopic }, { mode: rawMode }] =
    await Promise.all([params, searchParams]);

  const semNum = Number(rawSem);
  if (semNum !== 1 && semNum !== 2) notFound();
  const topicId = decodeURIComponent(rawTopic);
  const topic = getPowerpointById(topicId);
  if (!topic || topic.semester !== semNum) notFound();
  const semester = semNum as Semester;

  const mode: QuizMode = rawMode === "exam" ? "exam" : "study";

  // Study mode: send the full 50-question pool — runner picks 10 client-side
  // based on localStorage rotation. Exam mode: 50 across all topics.
  const questions =
    mode === "exam"
      ? getExamQuestionsForSemester(semester, 50)
      : getAllQuestionsForPowerpoint(topic.id);

  if (questions.length === 0) notFound();

  return <StudyQuizRunner topic={topic} pool={questions} mode={mode} />;
}
