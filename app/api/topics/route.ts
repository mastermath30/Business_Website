import { NextResponse } from "next/server";
import { getPowerpointsBySemester } from "@/lib/db/seed";
import type { Semester } from "@/lib/db/schema";

// GET /api/topics?semester=1
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("semester");
  const semesterNum = Number(raw);
  if (semesterNum !== 1 && semesterNum !== 2) {
    return NextResponse.json(
      { error: "semester must be 1 or 2" },
      { status: 400 }
    );
  }
  const semester = semesterNum as Semester;
  const topics = getPowerpointsBySemester(semester);
  return NextResponse.json({ topics });
}
