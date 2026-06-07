import { notFound } from "next/navigation";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { getQuestionsForTopic, getTopic } from "@/lib/quiz-helpers";
import { topics } from "@/lib/data";

export function generateStaticParams() {
  return topics.map((t) => ({ id: t.id }));
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const topic = getTopic(id);
  if (!topic) notFound();
  const questions = getQuestionsForTopic(id, 8);
  if (questions.length === 0) notFound();
  return <QuizRunner topic={topic} questions={questions} />;
}
