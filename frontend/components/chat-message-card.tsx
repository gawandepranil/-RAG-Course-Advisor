"use client";

type CitationCard = {
  label: string;
  meta?: string;
  snippet?: string;
};

type ChatMessageCardProps = {
  title: string;
  status: string;
  statusTone?: "eligible" | "warning" | "neutral";
  why: string;
  citations?: CitationCard[];
  clarifyingQuestions?: string[];
};

function getStatusClasses(statusTone: "eligible" | "warning" | "neutral" = "neutral") {
  switch (statusTone) {
    case "eligible":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

export default function ChatMessageCard({
  title,
  status,
  statusTone = "neutral",
  why,
  citations = [],
  clarifyingQuestions = [],
}: ChatMessageCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur-xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>

        <div
          className={`rounded-full border px-4 py-2 text-sm font-medium ${getStatusClasses(
            statusTone
          )}`}
        >
          {status}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Why</h3>
          <p className="whitespace-pre-line text-lg leading-8 text-slate-700">{why}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            Citations
          </h3>

          {citations.length > 0 ? (
            <div className="space-y-3">
              {citations.map((citation, index) => (
                <div
                  key={`${citation.label}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-800">{citation.label}</p>

                  {citation.meta ? (
                    <p className="mt-1 break-all text-xs text-slate-500">{citation.meta}</p>
                  ) : null}

                  {citation.snippet ? (
                    <p className="mt-2 text-sm text-slate-600">{citation.snippet}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No citations available.</p>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            Clarifying Questions
          </h3>

          {clarifyingQuestions.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5 text-slate-700">
              {clarifyingQuestions.map((question, index) => (
                <li key={`${question}-${index}`} className="text-lg leading-7">
                  {question}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No clarifying questions.</p>
          )}
        </div>
      </div>
    </div>
  );
}