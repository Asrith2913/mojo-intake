export type IntakeMessage = {
  role: "user" | "assistant";
  content: string;
};

export type IntakeRecord = {
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

export type LeadScoreResult = {
  lead_score: number;
  priority: "low" | "normal" | "high" | "urgent";
  route_to: string;
  reason: string;
};

export type FollowupResult = {
  internal_note: string;
  sms: string;
  email: string;
};

export type ReviewPayload = {
  initialIssue: string;
  questions: string[];
  answers: string[];
  record: IntakeRecord;
  score: LeadScoreResult;
  followup: FollowupResult;
};