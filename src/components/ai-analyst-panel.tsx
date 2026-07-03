"use client";

import { useState } from "react";
import {
  ANALYST_QUICK_QUESTIONS,
  getAnalystMockReply,
} from "@/data/article-insights";

export type AnalystMessage = {
  role: "user" | "assistant";
  text: string;
};

type Props = {
  articleId: string;
  disabled?: boolean;
};

export function AiAnalystPanel({ articleId, disabled }: Props) {
  const [input, setInput] = useState("");
  const [messagesByArticle, setMessagesByArticle] = useState<
    Record<string, AnalystMessage[]>
  >({});

  const messages = messagesByArticle[articleId] ?? [];

  function ask(question: string) {
    const q = question.trim();
    if (!q || disabled) return;

    const reply = getAnalystMockReply(q, articleId);
    setMessagesByArticle((prev) => ({
      ...prev,
      [articleId]: [
        ...(prev[articleId] ?? []),
        { role: "user", text: q },
        { role: "assistant", text: reply },
      ],
    }));
    setInput("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
          AI
        </span>
        <span className="text-sm font-semibold text-slate-800">
          アナリスト — 記事・業務文脈を横断して分析
        </span>
      </div>
      <p className="mb-3 text-xs text-slate-500">
        記事を読んだまま質問できます（モック応答・セッション内のみ）
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {ANALYST_QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={disabled}
            onClick={() => ask(q)}
            className="rounded-full border border-blue-200 bg-white px-2.5 py-1 text-xs text-blue-800 hover:bg-blue-50 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {messages.length > 0 && (
        <ul className="mb-3 max-h-40 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2">
          {messages.map((m, i) => (
            <li
              key={`${articleId}-${i}`}
              className={`text-sm leading-relaxed ${
                m.role === "user"
                  ? "text-right text-blue-900"
                  : "text-left text-slate-700"
              }`}
            >
              {m.role === "user" ? (
                <span className="inline-block rounded-lg bg-blue-100 px-2 py-1 text-left">
                  {m.text}
                </span>
              ) : (
                <span className="inline-block rounded-lg bg-slate-100 px-2 py-1">
                  {m.text}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder="この記事について質問する…"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          送信
        </button>
      </form>
    </div>
  );
}
