import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { extractSystemPrompt } from "@/lib/prompts";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Could not parse JSON from model output.");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const initialIssue = String(body.initialIssue || "").trim();
    const questions = Array.isArray(body.questions) ? body.questions : [];
    const answers = Array.isArray(body.answers) ? body.answers : [];

    if (!initialIssue) {
      return NextResponse.json({ error: "initialIssue is required" }, { status: 400 });
    }

    const transcriptLines: string[] = [];
    transcriptLines.push(`Initial issue: ${initialIssue}`);

    for (let i = 0; i < Math.max(questions.length, answers.length); i += 1) {
      if (questions[i]) transcriptLines.push(`Assistant: ${questions[i]}`);
      if (answers[i]) transcriptLines.push(`User: ${answers[i]}`);
    }

    const transcript = transcriptLines.join("\n");

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: extractSystemPrompt },
        {
          role: "user",
          content: `Extract structured intake data from this transcript:\n\n${transcript}`,
        },
      ],
    });

    const text = response.output_text || "";

    console.log("EXTRACT OUTPUT TEXT:", text);

    const parsed = safeJsonParse(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Extract API error:", error);
    return NextResponse.json(
      {
        practice_area: "",
        summary: "Unable to extract structured data automatically.",
        jurisdiction: "",
        incident_date: "",
        urgency: "",
        represented: "",
        damages_or_harm: "",
        deadline_risk: "",
        contact_preference: "",
        missing_info: ["practice_area", "jurisdiction", "incident_date"],
        confidence: 0.2,
        fallback: true,
      },
      { status: 200 }
    );
  }
}