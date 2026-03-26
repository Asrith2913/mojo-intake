import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border bg-white p-10 shadow-sm">
          <div className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            MoJo Intake
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            AI Legal Lead Qualification and Routing
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Capture legal inquiries, ask focused follow-up questions, extract structured intake data,
            score urgency, route leads, and draft follow-up communication.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/intake"
              className="rounded-2xl bg-black px-5 py-3 text-white transition hover:opacity-90"
            >
              Start Intake
            </Link>
            <Link
              href="/review"
              className="rounded-2xl border px-5 py-3 transition hover:bg-gray-100"
            >
              View Review Dashboard
            </Link>
          </div>

          <div className="mt-8 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            Disclaimer: This demo is for intake and routing only. It does not provide legal advice.
          </div>
        </div>
      </div>
    </main>
  );
}