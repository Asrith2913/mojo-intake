# MoJo Intake — AI Legal Lead Qualification and Routing

MoJo Intake is a lightweight AI-powered legal intake demo built to show how unstructured client input can be transformed into structured, operationally useful output.

The app collects a prospective client’s issue, asks targeted follow-up questions, extracts key case facts into structured data, scores the lead, routes it to the appropriate intake queue, and drafts follow-up communications for staff and client outreach.

## Why this project exists

This project was built to demonstrate applied AI orchestration in a real business workflow.

Instead of using AI as a simple chatbot, the system uses a staged workflow to:
- gather missing information
- structure messy text into usable intake data
- score and prioritize the lead
- route the lead to the right queue
- generate internal and external follow-up content

The goal is operational leverage: turning minimal human input into high-value downstream actions.

## What the app does

A user starts by describing a legal issue, such as a car accident, workplace issue, or family-law matter.

The system then:
1. asks follow-up intake questions
2. extracts facts into a structured intake record
3. estimates confidence and completeness
4. scores lead quality and urgency
5. routes the lead to an internal queue
6. drafts an internal note, SMS, and email follow-up

The review dashboard presents both:
- human-readable operational output
- technical payloads for traceability

## Core features

- AI-generated follow-up intake questions
- Structured extraction into intake JSON
- Lead scoring and routing logic
- Confidence and completeness handling
- Internal note generation
- SMS draft generation
- Email draft generation
- Case snapshot dashboard
- Technical routing payload for inspection

## Example workflow

1. A prospective client enters:
   - “I was rear-ended two weeks ago in New Jersey. My shoulder has been hurting since then and I missed several days of work.”
2. The app asks targeted follow-up questions
3. The answers are converted into a structured intake record
4. The lead is scored and routed, for example to:
   - `Personal Injury Queue`
5. The app produces:
   - a concise summary
   - an internal note for staff
   - a follow-up SMS
   - a follow-up email

## Tech stack

- **Next.js** — frontend and API routes
- **TypeScript** — typed application logic
- **Tailwind CSS** — UI styling
- **OpenAI API** — follow-up question generation, extraction, and follow-up drafting
- **Vercel** — deployment

## Project structure

```bash
app/
  api/
    interview/route.ts
    extract/route.ts
    score-local/route.ts
    followup/route.ts
  intake/page.tsx
  review/page.tsx
  page.tsx

components/
  JsonPanel.tsx
  ScoreBadge.tsx

lib/
  prompts.ts
  scoring.ts
  types.ts