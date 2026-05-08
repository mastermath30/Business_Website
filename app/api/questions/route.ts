import { NextResponse } from "next/server";
import {
  getExamQuestionsForSemester,
  getPowerpointById,
  getQuestionsForPowerpoint,
} from "@/lib/db/seed";
import type { QuizMode, Semester } from "@/lib/db/schema";

// GET /api/questions?topic_id=X&mode=study|exam
//   - study: 10 questions from the given topic
//   - exam:  50 questions across all topics in that topic's semester
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topic_id");
  const mode = (searchParams.get("mode") ?? "study") as QuizMode;

  if (!topicId) {
    return NextResponse.json(
      { error: "topic_id is required" },
      { status: 400 }
    );
  }
  if (mode !== "study" && mode !== "exam") {
    return NextResponse.json(
      { error: "mode must be study or exam" },
      { status: 400 }
    );
  }

  const topic = getPowerpointById(topicId);
  if (!topic) {
    return NextResponse.json({ error: "topic not found" }, { status: 404 });
  }

  const questions =
    mode === "exam"
      ? getExamQuestionsForSemester(topic.semester as Semester, 50)
      : getQuestionsForPowerpoint(topicId, 10);

  return NextResponse.json({ topic, mode, questions });
}
