import { IntakeRecord, LeadScoreResult } from "./types";

function includesYes(value: string): boolean {
  return value.toLowerCase().includes("yes");
}

function summarizeRouteReason(record: IntakeRecord, routeTo: string): string {
  const parts: string[] = [];

  if (record.practice_area) {
    parts.push(`${record.practice_area} intake`);
  } else {
    parts.push("General intake");
  }

  if (record.jurisdiction) {
    parts.push(`in ${record.jurisdiction}`);
  }

  if (record.incident_date) {
    parts.push(`from ${record.incident_date}`);
  }

  if (record.damages_or_harm) {
    parts.push(`with reported harm: ${record.damages_or_harm}`);
  }

  if (record.represented) {
    parts.push(`represented: ${record.represented}`);
  }

  if (record.urgency) {
    parts.push(`urgency: ${record.urgency}`);
  }

  parts.push(`confidence: ${record.confidence}`);

  if (record.missing_info.length > 0) {
    parts.push(`missing: ${record.missing_info.join(", ")}`);
  }

  let routeLabel = "manual review";
  if (routeTo === "personal_injury_queue") routeLabel = "personal injury queue";
  else if (routeTo === "employment_queue") routeLabel = "employment queue";
  else if (routeTo === "family_law_queue") routeLabel = "family law queue";
  else if (routeTo === "general_intake_review") routeLabel = "general intake review";

  return `${parts.join("; ")}. Routed to ${routeLabel} based on practice-area match and intake completeness.`;
}

export function scoreLead(record: IntakeRecord): LeadScoreResult {
  let score = 40;

  if (record.practice_area) score += 10;
  if (record.incident_date) score += 10;
  if (record.jurisdiction) score += 10;
  if (record.damages_or_harm) score += 10;
  if (record.contact_preference) score += 5;
  if (record.confidence >= 0.75) score += 10;
  if (record.confidence < 0.6) score -= 10;
  if (includesYes(record.deadline_risk)) score += 10;
  if (includesYes(record.represented)) score -= 20;
  if (record.missing_info.length >= 3) score -= 10;

  score = Math.max(0, Math.min(100, score));

  let priority: LeadScoreResult["priority"] = "normal";
  if (includesYes(record.deadline_risk) || record.urgency.toLowerCase() === "urgent") {
    priority = "urgent";
  } else if (score >= 80 || record.urgency.toLowerCase() === "high") {
    priority = "high";
  } else if (score < 40 || record.urgency.toLowerCase() === "low") {
    priority = "low";
  }

  const area = record.practice_area.toLowerCase();
  let route_to = "manual_review";

  if (record.confidence < 0.6) {
    route_to = "manual_review";
  } else if (area.includes("injury") || area.includes("accident")) {
    route_to = "personal_injury_queue";
  } else if (area.includes("employment") || area.includes("wage") || area.includes("termination")) {
    route_to = "employment_queue";
  } else if (area.includes("family") || area.includes("custody") || area.includes("divorce")) {
    route_to = "family_law_queue";
  } else {
    route_to = "general_intake_review";
  }

  const reason = summarizeRouteReason(record, route_to);

  return {
    lead_score: score,
    priority,
    route_to,
    reason,
  };
}