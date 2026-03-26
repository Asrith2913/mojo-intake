"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type ExtractedRecord = {
  practice_area: string;
  summary: string;
  jurisdiction: string;
  incident_date: string;
  urgency: string;
  represented: string;
  damages_or_harm: string;
  deadline_risk: string;
  contact_preference: string;
  missing_info: string[];
  confidence: number;
};

type ScoreResult = {
  lead_score: number;
  priority: "low" | "normal" | "high" | "urgent";
  route_to: string;
  reason: string;
};

type FollowupResult = {
  internal_note: string;
  sms: string;
  email: string;
};

export default function IntakePage() {
  const router = useRouter();

  const [initialIssue, setInitialIssue] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submittingFinal, setSubmittingFinal] = useState(false);
  const [error, setError] = useState("");

  async function generateQuestions(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoadingQuestions(true);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initialIssue }),
      });

      const data = await res.json();
      const nextQuestions = Array.isArray(data.questions) ? data.questions : [];
      setQuestions(nextQuestions);
      setAnswers(new Array(nextQuestions.length).fill(""));
    } catch (err) {
      console.error(err);
      setError("Failed to generate follow-up questions.");
    } finally {
      setLoadingQuestions(false);
    }
  }

  function updateAnswer(index: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function finalizeIntake() {
    setError("");
    setSubmittingFinal(true);

    try {
      const extractRes = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initialIssue, questions, answers }),
      });

      const record: ExtractedRecord = await extractRes.json();

      const scoreRes = await fetch("/api/score-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      const score: ScoreResult = await scoreRes.json();

      const followupRes = await fetch("/api/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initialIssue, questions, answers, record, score }),
      });

      const followup: FollowupResult = await followupRes.json();

      const reviewPayload = {
        initialIssue,
        questions,
        answers,
        record,
        score,
        followup,
      };

      sessionStorage.setItem("latestReviewPayload", JSON.stringify(reviewPayload));
      router.push("/review");
    } catch (err) {
      console.error(err);
      setError("Failed to complete intake.");
    } finally {
      setSubmittingFinal(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">Start Legal Intake</h1>
          <p className="mt-2 text-gray-600">
            Describe the issue, answer a few intake questions, and generate a structured review.
          </p>

          <form onSubmit={generateQuestions} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Describe the legal issue</span>
              <textarea
                value={initialIssue}
                onChange={(e) => setInitialIssue(e.target.value)}
                className="min-h-[140px] w-full rounded-2xl border p-4 outline-none focus:ring"
                placeholder="Example: I was rear-ended two weeks ago in New Jersey, hurt my shoulder, and missed work."
              />
            </label>

            <button
              type="submit"
              disabled={!initialIssue || loadingQuestions}
              className="rounded-2xl bg-black px-5 py-3 text-white disabled:opacity-50"
            >
              {loadingQuestions ? "Generating questions..." : "Generate Follow-up Questions"}
            </button>
          </form>

          {questions.length > 0 && (
            <div className="mt-10 space-y-5">
              <h2 className="text-xl font-semibold">Follow-up Questions</h2>

              {questions.map((question, index) => (
                <div key={`${question}-${index}`} className="rounded-2xl border p-4">
                  <div className="font-medium">{question}</div>
                  <textarea
                    value={answers[index] || ""}
                    onChange={(e) => updateAnswer(index, e.target.value)}
                    className="mt-3 min-h-[100px] w-full rounded-xl border p-3 outline-none focus:ring"
                    placeholder="Your answer..."
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={finalizeIntake}
                disabled={submittingFinal}
                className="rounded-2xl bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
              >
                {submittingFinal ? "Analyzing intake..." : "Generate Review Output"}
              </button>
            </div>
          )}

          {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}

          <div className="mt-8 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            This demo is for intake and routing only. It does not provide legal advice.
          </div>
        </div>
      </div>
    </main>
  );
}