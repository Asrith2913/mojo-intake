import { NextRequest, NextResponse } from "next/server";
import { scoreLead } from "@/lib/scoring";

export async function POST(req: NextRequest) {
  try {
    const record = await req.json();
    const score = scoreLead(record);
    return NextResponse.json(score);
  } catch (error) {
    console.error("Score API error:", error);
    return NextResponse.json({ error: "Failed to score lead" }, { status: 500 });
  }
}