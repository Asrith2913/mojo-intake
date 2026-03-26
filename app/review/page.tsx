"use client";

import { useEffect, useState } from "react";
import JsonPanel from "@/components/JsonPanel";
import ScoreBadge from "@/components/ScoreBadge";

type ReviewPayload = {
  initialIssue: string;
  questions: string[];
  answers: string[];
  record: {
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
  score: {
    lead_score: number;
    priority: "low" | "normal" | "high" | "urgent";
    route_to: string;
    reason: string;
  };
  followup: {
    internal_note: string;
    sms: string;
    email: string;
  };
};

function formatRouteLabel(route: string) {
  return route
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatFallback(value: string) {
  return value && value.trim() ? value : "Not provided";
}

export default function ReviewPage() {
  const [data, setData] = useState<ReviewPayload | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("latestReviewPayload");
    if (raw) {
      setData(JSON.parse(raw));
    }
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">Review Dashboard</h1>
          <p className="mt-3 text-gray-600">
            No review data found yet. Start an intake first.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">Review Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Structured intake output, scoring, routing, and follow-up drafts.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <ScoreBadge label="Lead Score" value={data.score.lead_score} />
          <ScoreBadge label="Priority" value={data.score.priority} />
          <ScoreBadge label="Route" value={formatRouteLabel(data.score.route_to)} />
          <ScoreBadge label="Confidence" value={data.record.confidence} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Original Issue</h2>
            <p className="mt-3 whitespace-pre-wrap text-gray-700">{data.initialIssue}</p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Summary</h2>
            <p className="mt-3 whitespace-pre-wrap text-gray-700">{data.record.summary}</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Case Snapshot</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="text-sm text-gray-500">Practice Area</div>
              <div className="mt-1 font-semibold">
                {formatFallback(data.record.practice_area)}
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="text-sm text-gray-500">Jurisdiction</div>
              <div className="mt-1 font-semibold">
                {formatFallback(data.record.jurisdiction)}
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="text-sm text-gray-500">Incident Date</div>
              <div className="mt-1 font-semibold">
                {formatFallback(data.record.incident_date)}
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="text-sm text-gray-500">Urgency</div>
              <div className="mt-1 font-semibold">
                {formatFallback(data.record.urgency)}
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="text-sm text-gray-500">Represented</div>
              <div className="mt-1 font-semibold">
                {formatFallback(data.record.represented)}
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="text-sm text-gray-500">Contact Preference</div>
              <div className="mt-1 font-semibold">
                {formatFallback(data.record.contact_preference)}
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 md:col-span-2 lg:col-span-3">
              <div className="text-sm text-gray-500">Damages / Harm</div>
              <div className="mt-1 font-semibold">
                {formatFallback(data.record.damages_or_harm)}
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 md:col-span-2 lg:col-span-3">
              <div className="text-sm text-gray-500">Deadline Risk</div>
              <div className="mt-1 font-semibold">
                {formatFallback(data.record.deadline_risk)}
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 md:col-span-2 lg:col-span-3">
              <div className="text-sm text-gray-500">Missing Info</div>
              <div className="mt-1 font-semibold">
                {data.record.missing_info.length > 0
                  ? data.record.missing_info.join(", ")
                  : "None"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Routing Decision</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Assigned Queue</div>
                <div className="mt-1 font-semibold">
                  {formatRouteLabel(data.score.route_to)}
                </div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Routing Reason</div>
                <div className="mt-1 text-gray-800">{data.score.reason}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Follow-up Transcript</h2>
            <div className="mt-4 space-y-4">
              {data.questions.map((q, i) => (
                <div key={`${q}-${i}`} className="rounded-xl bg-gray-50 p-4">
                  <div className="font-medium">Q: {q}</div>
                  <div className="mt-2 text-gray-700">A: {data.answers[i] || "-"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Internal Note</h3>
            <p className="mt-3 whitespace-pre-wrap text-gray-700">
              {data.followup.internal_note}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">SMS Draft</h3>
            <p className="mt-3 whitespace-pre-wrap text-gray-700">
              {data.followup.sms}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Email Draft</h3>
            <p className="mt-3 whitespace-pre-wrap text-gray-700">
              {data.followup.email}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <JsonPanel title="Structured Intake Record" data={data.record} />
          <JsonPanel title="Technical Routing Payload" data={data.score} />
        </div>
      </div>
    </main>
  );
}