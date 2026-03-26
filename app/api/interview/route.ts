import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { interviewSystemPrompt } from "@/lib/prompts";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const initialIssue = String(body.initialIssue || "").trim();

    if (!initialIssue) {
      return NextResponse.json({ error: "initialIssue is required" }, { status: 400 });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: interviewSystemPrompt },
        {
          role: "user",
          content: `User's legal issue:\n${initialIssue}`,
        },
      ],
    });

    const text = response.output_text;
    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Interview API error:", error);
    return NextResponse.json(
      {
        questions: [
          "What happened, in one or two sentences?",
          "When did this happen?",
          "What state did this happen in?",
          "Were there any injuries, financial losses, or urgent deadlines?",
        ],
        fallback: true,
      },
      { status: 200 }
    );
  }
}