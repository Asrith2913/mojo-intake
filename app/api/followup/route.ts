import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { followupSystemPrompt } from "@/lib/prompts";

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

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: followupSystemPrompt },
        {
          role: "user",
          content: `Generate follow-up content for this intake result:\n${JSON.stringify(body, null, 2)}`,
        },
      ],
    });

    const text = response.output_text || "";

    console.log("FOLLOWUP OUTPUT TEXT:", text);

    const parsed = safeJsonParse(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Followup API error:", error);
    return NextResponse.json(
      {
        internal_note: "Review lead manually. Automated follow-up generation failed.",
        sms: "Thanks for reaching out. We received your intake and someone will review it shortly.",
        email:
          "Thank you for reaching out. We received your intake information and a member of the team will review it shortly.",
        fallback: true,
      },
      { status: 200 }
    );
  }
}