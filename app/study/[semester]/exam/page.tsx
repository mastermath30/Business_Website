import { notFound } from "next/navigation";
import { StudyQuizRunner } from "@/components/study/StudyQuizRunner";
import { getExamQuestionsForSemester } from "@/lib/db/seed";
import type { Semester } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ semester: "1" }, { semester: "2" }];
}

export default async function SemesterExamPage({
  params,
}: {
  params: Promise<{ semester: string }>;
}) {
  const { semester: rawSem } = await params;
  const semNum = Number(rawSem);
  if (semNum !== 1 && semNum !== 2) notFound();
  const semester = semNum as Semester;

  const questions = getExamQuestionsForSemester(semester, 50);
  if (questions.length === 0) notFound();

  const examTopic = {
    id: `s${semester}-exam`,
    semester,
    topic_name: `Semester ${semester} Final Exam`,
    file_path: "",
  };

  return <StudyQuizRunner topic={examTopic} pool={questions} mode="exam" />;
}
