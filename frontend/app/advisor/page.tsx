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
    `${escaped}:\\s*([\\s\\S]*?)(?=\\n(?:Answer / Plan|Why|Citations|Clarifying questions|Assumptions / Not in catalog):|$)`,
    "i"
  );
  const match = text.match(regex);
  return match ? match[1].trim() : "";
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
      "Can I take 21 credits in one quarter?",
    ],
    []
  );

  const handleAsk = async (customQuery?: string) => {
    const finalQuery = (customQuery ?? query).trim();
    if (!finalQuery || loading) return;

    const userMessage: Message = {
      role: "user",
      text: finalQuery,
    };

    setMessages((prev) => [...prev, userMessage]);
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
          text: `Answer / Plan:
Unable to process your request right now.

Why:
The frontend could not connect to the backend API or the server returned an error.

Citations:
None

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
            const answerPlan =
              message.role === "assistant"
                ? extractSection(message.text, "Answer / Plan")
                : "";
            const why =
              message.role === "assistant" ? extractSection(message.text, "Why") : "";
            const clarifying =
              message.role === "assistant"
                ? extractSection(message.text, "Clarifying questions")
                : "";
            const assumptions =
              message.role === "assistant"
                ? extractSection(message.text, "Assumptions / Not in catalog")
                : "";

            const clarifyingItems =
              clarifying && clarifying.toLowerCase() !== "none"
                ? clarifying
                    .split("\n")
                    .map((item) => item.replace(/^[-•]\s*/, "").trim())
                    .filter(Boolean)
                : [];

            const hasDetails =
              message.role === "assistant" &&
              (why ||
                assumptions ||
                clarifyingItems.length > 0 ||
                (message.sources && message.sources.length > 0));

            const isOpen = openDetailsIndex === index;

            return (
              <div key={index} className="space-y-3">
                <div
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
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
                          {answerPlan || message.text}
                        </p>

                        {hasDetails && (
                          <button
                            onClick={() =>
                              setOpenDetailsIndex(isOpen ? null : index)
                            }
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
                            {why && (
                              <div>
                                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Why
                                </h3>
                                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                  {why}
                                </p>
                              </div>
                            )}

                            {message.sources && message.sources.length > 0 && (
                              <div>
                                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Sources
                                </h3>
                                <div className="space-y-2">
                                  {message.sources.map((src, srcIndex) => (
                                    <div
                                      key={`${src.source}-${srcIndex}`}
                                      className="rounded-xl border border-slate-200 bg-white p-3"
                                    >
                                      <p className="text-sm font-semibold text-slate-800">
                                        {src.course_code ? `${src.course_code} · ` : ""}
                                        {src.source}
                                      </p>
                                      <p className="mt-1 text-xs text-slate-500">
                                        {src.type || "unknown"}
                                      </p>
                                      {src.source_url && (
                                        <p className="mt-1 break-all text-xs text-slate-500">
                                          {src.source_url}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {clarifyingItems.length > 0 && (
                              <div>
                                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Clarifying questions
                                </h3>
                                <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-slate-700">
                                  {clarifyingItems.map((item, itemIndex) => (
                                    <li key={`${item}-${itemIndex}`}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {assumptions && assumptions.toLowerCase() !== "none" && (
                              <div>
                                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Assumptions
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
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white">
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

        <div className="sticky bottom-0 mt-6 bg-gradient-to-t from-[#f7f7f8] via-[#f7f7f8] to-transparent pt-6">
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