"use client";

import { useMemo, useState } from "react";
import { Bot, User, Loader2, ChevronDown, ChevronUp } from "lucide-react";

type RetrievedSource = {
  source: string;
  course_code?: string;
  type?: string;
  source_url?: string;
};

type ApiResponse = {
  answer: string;
  retrieved_sources: RetrievedSource[];
};

type Message = {
  role: "user" | "assistant";
  text: string;
  sources?: RetrievedSource[];
};

function extractSection(text: string, section: string) {
  const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `${escaped}:\\s*([\\s\\S]*?)(?=\\n(?:Answer / Plan|Decision|Course Plan|Evidence|Why|Next step|Citations|Clarifying questions|Assumptions \\/ Not in catalog):|$)`,
    "i"
  );
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function parseLines(section: string) {
  if (!section || section.toLowerCase() === "none") return [];
  return section
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

function getMainReply(decision: string, evidence: string, fallback: string) {
  const cleanDecision = decision.trim();
  const cleanEvidence = evidence.trim();

  if (!cleanDecision) return fallback;

  const lower = cleanDecision.toLowerCase();

  if (lower === "answered from catalog") {
    return cleanEvidence || "I found the answer in the catalog.";
  }

  if (lower === "need more info" || lower === "need more information") {
    return "I need a bit more information to guide you properly.";
  }

  if (lower === "eligible") {
    return "You appear eligible based on the information provided.";
  }

  if (lower === "not eligible") {
    return "You do not appear eligible based on the information provided.";
  }

  return cleanDecision;
}

export default function AdvisorPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [openDetailsIndex, setOpenDetailsIndex] = useState<number | null>(null);

  const suggestedQueries = useMemo(
    () => [
      "What do I need before CSE 421?",
      "Can I take CSE 446 after CSE 312 and CSE 332?",
      "What are the BSCS core courses?",
      "Where should I start if I want to study computer science?",
    ],
    []
  );

  const handleAsk = async (customQuery?: string) => {
    const finalQuery = (customQuery ?? query).trim();
    if (!finalQuery || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: finalQuery,
      },
    ]);

    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: finalQuery }),
      });

      if (!res.ok) {
        throw new Error(`Backend returned ${res.status}`);
      }

      const data: ApiResponse = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
          sources: data.retrieved_sources ?? [],
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Decision:
Need more info

Course Plan:
None

Evidence:
The frontend could not connect to the backend API or the server returned an error.

Why:
The request could not be completed because the backend is unavailable.

Next step:
Make sure the backend is running and try again.

Citations:
None (No relevant information found in retrieved documents)

Clarifying questions:
None

Assumptions / Not in catalog:
This is a system connectivity issue, not a catalog-grounding result.`,
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f8] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 pb-6 pt-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">HuskyPath</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ask about prerequisites, policies, and degree planning.
          </p>
        </div>

        <div className="flex-1 space-y-6 pb-32">
          {messages.length === 0 && (
            <div className="mt-10">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-800">
                How can I help with your academic plan?
              </h2>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {suggestedQueries.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleAsk(item)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => {
            const decision =
              message.role === "assistant" ? extractSection(message.text, "Decision") : "";
            const coursePlan =
              message.role === "assistant" ? extractSection(message.text, "Course Plan") : "";
            const evidence =
              message.role === "assistant" ? extractSection(message.text, "Evidence") : "";
            const why =
              message.role === "assistant" ? extractSection(message.text, "Why") : "";
            const nextStep =
              message.role === "assistant" ? extractSection(message.text, "Next step") : "";
            const citations =
              message.role === "assistant" ? extractSection(message.text, "Citations") : "";
            const clarifying =
              message.role === "assistant"
                ? extractSection(message.text, "Clarifying questions")
                : "";
            const assumptions =
              message.role === "assistant"
                ? extractSection(message.text, "Assumptions / Not in catalog")
                : "";

            const planItems = parseLines(coursePlan);
            const clarifyingItems = parseLines(clarifying);
            const citationItems =
              citations &&
              citations.toLowerCase() !== "none" &&
              !citations.toLowerCase().startsWith("none (")
                ? citations.split("\n").map((line) => line.trim()).filter(Boolean)
                : [];

            const isOpen = openDetailsIndex === index;

            const hasDetails =
              message.role === "assistant" &&
              (planItems.length > 0 ||
                why ||
                nextStep ||
                citationItems.length > 0 ||
                clarifyingItems.length > 0 ||
                (assumptions && assumptions.toLowerCase() !== "none"));

            const mainReply =
              message.role === "assistant"
                ? getMainReply(decision, evidence, message.text)
                : message.text;

            return (
              <div key={index} className="space-y-3">
                <div
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4b2e83] text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-3xl px-5 py-4 shadow-sm ${
                      message.role === "user"
                        ? "bg-[#4b2e83] text-white"
                        : "border border-slate-200 bg-white text-slate-800"
                    }`}
                  >
                    {message.role === "user" ? (
                      <p className="whitespace-pre-wrap text-[15px] leading-7">{message.text}</p>
                    ) : (
                      <div className="space-y-3">
                        <p className="whitespace-pre-wrap text-[15px] leading-7">
                          {mainReply}
                        </p>

                        {clarifyingItems.length > 0 && (
                          <div className="mt-1 space-y-2">
                            {clarifyingItems.map((q, i) => (
                              <button
                                key={i}
                                onClick={() => handleAsk(q)}
                                className="block w-fit rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        )}

                        {hasDetails && (
                          <button
                            onClick={() => setOpenDetailsIndex(isOpen ? null : index)}
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
                          >
                            {isOpen ? (
                              <>
                                Hide details <ChevronUp className="h-4 w-4" />
                              </>
                            ) : (
                              <>
                                Show details <ChevronDown className="h-4 w-4" />
                              </>
                            )}
                          </button>
                        )}

                        {hasDetails && isOpen && (
                          <div className="space-y-4 rounded-2xl bg-slate-50 p-4">
                            {decision && (
                              <div>
                                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Decision
                                </h3>
                                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                  {decision}
                                </p>
                              </div>
                            )}

                            {planItems.length > 0 && (
                              <div>
                                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Course Plan
                                </h3>
                                <ul className="space-y-2 text-sm leading-7 text-slate-700">
                                  {planItems.map((item, itemIndex) => (
                                    <li key={`${item}-${itemIndex}`}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {why && why.toLowerCase() !== "none" && (
                              <div>
                                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Why
                                </h3>
                                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                  {why}
                                </p>
                              </div>
                            )}

                            {nextStep && nextStep.toLowerCase() !== "none" && (
                              <div>
                                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Next Step
                                </h3>
                                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                  {nextStep}
                                </p>
                              </div>
                            )}

                            <div>
                              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Citations
                              </h3>
                              {citationItems.length > 0 ? (
                                <div className="space-y-2">
                                  {citationItems.map((item, itemIndex) => (
                                    <div
                                      key={`${item}-${itemIndex}`}
                                      className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700"
                                    >
                                      {item}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-500">
                                  None (No relevant information found in retrieved documents)
                                </div>
                              )}
                            </div>

                            {assumptions && assumptions.toLowerCase() !== "none" && (
                              <div>
                                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Assumptions / Not in catalog
                                </h3>
                                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                  {assumptions}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start gap-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#4b2e83] text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 mt-10 bg-gradient-to-t from-[#f7f7f8] via-[#f7f7f8] to-transparent pt-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-lg">
            <div className="flex items-end gap-3">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask HuskyPath anything..."
                rows={1}
                className="max-h-40 min-h-[52px] flex-1 resize-none rounded-2xl border border-transparent bg-transparent px-3 py-3 text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAsk();
                  }
                }}
              />
              <button
                onClick={() => handleAsk()}
                disabled={loading || !query.trim()}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">
            HuskyPath can make mistakes. Check official catalog rules for final confirmation.
          </p>
        </div>
      </div>
    </main>
  );
}