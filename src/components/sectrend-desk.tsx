"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  articles,
  categories,
  getCategoryById,
  PILLAR_LABELS,
  type Article,
  type Pillar,
  type Priority,
} from "@/data/mock-articles";
import { articleAiComments } from "@/data/article-ai-comments";
import { getArticleInsight } from "@/data/article-insights";
import { AiAnalystPanel } from "@/components/ai-analyst-panel";
import { clamp, PaneResizeHandle } from "@/components/pane-resize-handle";

const PANE_DEFAULT = { p1: 208, p2: 320, p4: 420 };
const PANE_MIN = { p1: 160, p2: 220, p4: 260 };
const PANE_MAX = { p1: 360, p2: 520, p4: 560 };

const PRIORITY_STYLES: Record<
  Priority,
  { label: string; className: string }
> = {
  high: { label: "高", className: "bg-red-100 text-red-800" },
  medium: { label: "中", className: "bg-amber-100 text-amber-900" },
  low: { label: "低", className: "bg-slate-200 text-slate-700" },
};

const PANE_LABEL = "text-xs font-semibold text-slate-500";
const PANE_LABEL_SIDEBAR = "text-xs font-semibold text-blue-200";

type TagFilter = "all" | "unread" | "high" | "memo";
type SortMode = "date" | "memo_first";

function hasMemo(memos: Record<string, string>, articleId: string) {
  return (memos[articleId]?.trim().length ?? 0) > 0;
}

export function SecTrendDesk() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedArticleId, setSelectedArticleId] = useState<string>(
    articles[0]?.id ?? "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<TagFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("date");
  const [memos, setMemos] = useState<Record<string, string>>({});
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [expandedPillars, setExpandedPillars] = useState<Set<Pillar>>(
    () => new Set<Pillar>(["security", "governance", "industry"]),
  );
  const [paneWidths, setPaneWidths] = useState(PANE_DEFAULT);
  const [dbStatus, setDbStatus] = useState<
    "loading" | "ready" | "unconfigured" | "error"
  >("loading");
  const memoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUserData() {
      try {
        const res = await fetch("/api/user-data");
        if (cancelled) return;

        if (res.status === 503) {
          setDbStatus("unconfigured");
          return;
        }
        if (!res.ok) {
          setDbStatus("error");
          return;
        }

        const data = (await res.json()) as {
          memos: Record<string, string>;
          readIds: string[];
        };
        setMemos(data.memos ?? {});
        setReadIds(new Set(data.readIds ?? []));
        setDbStatus("ready");
      } catch {
        if (!cancelled) setDbStatus("error");
      }
    }

    loadUserData();
    return () => {
      cancelled = true;
    };
  }, []);

  function scheduleMemoSave(articleId: string, content: string) {
    if (dbStatus !== "ready") return;
    if (memoSaveTimerRef.current) clearTimeout(memoSaveTimerRef.current);
    memoSaveTimerRef.current = setTimeout(async () => {
      try {
        await fetch("/api/memos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId, content }),
        });
      } catch {
        /* 次回入力時に再試行 */
      }
    }, 600);
  }

  async function persistRead(articleId: string) {
    if (dbStatus !== "ready") return;
    try {
      await fetch("/api/reads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId }),
      });
    } catch {
      /* UI は楽観更新済み */
    }
  }

  const filteredArticles = useMemo(() => {
    let list = [...articles];

    if (selectedCategoryId) {
      list = list.filter((a) => a.categoryId === selectedCategoryId);
    }

    if (tagFilter === "unread") {
      list = list.filter((a) => a.unread && !readIds.has(a.id));
    } else if (tagFilter === "high") {
      list = list.filter((a) => a.priority === "high");
    } else if (tagFilter === "memo") {
      list = list.filter((a) => hasMemo(memos, a.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.titleEn?.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => {
      const aMemo = hasMemo(memos, a.id);
      const bMemo = hasMemo(memos, b.id);
      if (sortMode === "memo_first" && aMemo !== bMemo) {
        return aMemo ? -1 : 1;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return list;
  }, [selectedCategoryId, tagFilter, searchQuery, readIds, memos, sortMode]);

  const memoCount = useMemo(
    () => articles.filter((a) => hasMemo(memos, a.id)).length,
    [memos],
  );

  const selectedArticle: Article | undefined =
    articles.find((a) => a.id === selectedArticleId) ?? filteredArticles[0];

  const displayArticle = filteredArticles.some(
    (a) => a.id === selectedArticleId,
  )
    ? selectedArticle
    : filteredArticles[0];

  const currentMemo = displayArticle ? (memos[displayArticle.id] ?? "") : "";

  const aiComment = displayArticle
    ? articleAiComments[displayArticle.id]
    : undefined;

  const insight = displayArticle
    ? getArticleInsight(displayArticle.id)
    : undefined;

  function handleSelectArticle(id: string) {
    setSelectedArticleId(id);
    setReadIds((prev) => new Set(prev).add(id));
    void persistRead(id);
  }

  function togglePillar(pillar: Pillar) {
    setExpandedPillars((prev) => {
      const next = new Set(prev);
      if (next.has(pillar)) next.delete(pillar);
      else next.add(pillar);
      return next;
    });
  }

  function isUnread(article: Article) {
    return article.unread && !readIds.has(article.id);
  }

  const pillars: Pillar[] = ["security", "governance", "industry"];

  const filterBtn = (active: boolean) =>
    active
      ? "bg-cyan-500 text-white shadow-sm"
      : "bg-white/15 text-white hover:bg-white/25 border border-white/20";

  return (
    <div className="flex h-screen flex-col bg-slate-200 text-slate-900">
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-blue-900/40 bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] px-4 py-3 text-white shadow-md">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20 text-sm font-bold text-white ring-1 ring-white/30"
              aria-hidden
            >
              SEC
            </span>
            <h1 className="truncate text-lg font-semibold tracking-tight text-white">
              セキュリティトレンド・デスク
            </h1>
          </div>
          <p className="mt-0.5 pl-10 text-xs text-blue-100">
            業務に必要な情報収集
            {dbStatus === "ready" && " · メモ・既読を DB に保存"}
            {dbStatus === "unconfigured" &&
              " · DATABASE_URL 未設定（セッションのみ）"}
            {dbStatus === "error" && " · DB 接続エラー"}
          </p>
        </div>
        <div className="flex min-w-[200px] flex-1 items-center gap-2 md:max-w-md">
          <input
            type="search"
            placeholder="見出し・ソースで検索…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {(
            [
              { id: "all" as const, label: "すべて" },
              { id: "unread" as const, label: "未読" },
              { id: "high" as const, label: "重要度：高" },
              { id: "memo" as const, label: `メモあり (${memoCount})` },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTagFilter(f.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filterBtn(tagFilter === f.id)}`}
            >
              {f.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() =>
              setSortMode((m) => (m === "memo_first" ? "date" : "memo_first"))
            }
            title="メモした記事を一覧の上に表示"
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filterBtn(sortMode === "memo_first")}`}
          >
            {sortMode === "memo_first" ? "↑ メモ優先" : "メモ優先ソート"}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* ペイン1 */}
        <aside
          style={{ width: paneWidths.p1 }}
          className="flex shrink-0 flex-col bg-[#1e3a5f] text-white"
        >
          <div className="border-b border-white/10 px-3 py-2.5">
            <p className={PANE_LABEL_SIDEBAR}>ペイン1 · トピック</p>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className={`mb-2 w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                selectedCategoryId === null
                  ? "bg-white/20 font-semibold text-white ring-1 ring-white/30"
                  : "text-blue-50 hover:bg-white/10"
              }`}
            >
              すべての記事
            </button>
            {pillars.map((pillar) => {
              const pillarCats = categories.filter((c) => c.pillar === pillar);
              const expanded = expandedPillars.has(pillar);
              return (
                <div key={pillar} className="mb-1">
                  <button
                    type="button"
                    onClick={() => togglePillar(pillar)}
                    className="flex w-full items-center gap-1 rounded-lg px-2 py-2 text-left text-sm font-semibold text-white hover:bg-white/10"
                  >
                    <span className="text-blue-200">{expanded ? "▾" : "▸"}</span>
                    {PILLAR_LABELS[pillar]}
                  </button>
                  {expanded && (
                    <ul className="ml-3 border-l border-white/20 pl-2">
                      {pillarCats.map((cat) => (
                        <li key={cat.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedCategoryId(cat.id)}
                            className={`w-full rounded-md px-2 py-2 text-left text-sm transition-colors ${
                              selectedCategoryId === cat.id
                                ? "bg-white/20 font-semibold text-white"
                                : "text-blue-100 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {cat.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        <PaneResizeHandle
          onResize={(dx) =>
            setPaneWidths((w) => ({
              ...w,
              p1: clamp(w.p1 + dx, PANE_MIN.p1, PANE_MAX.p1),
            }))
          }
        />

        {/* ペイン2 */}
        <section
          style={{ width: paneWidths.p2 }}
          className="flex shrink-0 flex-col bg-white"
        >
          <div className="border-b border-slate-200 bg-slate-50 px-3 py-2.5">
            <p className={PANE_LABEL}>ペイン2 · 記事一覧</p>
            <p className="text-sm text-slate-600">
              {filteredArticles.length} 件
              {sortMode === "memo_first" && " · メモ優先順"}
            </p>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {filteredArticles.length === 0 ? (
              <li className="p-4 text-sm text-slate-600">
                {tagFilter === "memo"
                  ? "メモした記事がありません。ペイン4にメモを書くと表示されます。"
                  : "該当する記事がありません"}
              </li>
            ) : (
              filteredArticles.map((article) => {
                const cat = getCategoryById(article.categoryId);
                const active = displayArticle?.id === article.id;
                const pr = PRIORITY_STYLES[article.priority];
                const memoDone = hasMemo(memos, article.id);
                return (
                  <li key={article.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectArticle(article.id)}
                      className={`w-full border-b border-slate-100 px-3 py-3.5 text-left transition-colors ${
                        active
                          ? "bg-blue-50 ring-1 ring-inset ring-blue-300"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        {isUnread(article) ? (
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600"
                            title="未読"
                          />
                        ) : (
                          <span className="h-2.5 w-2.5 shrink-0" />
                        )}
                        {memoDone && (
                          <span
                            className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800"
                            title="メモあり"
                          >
                            MEMO
                          </span>
                        )}
                        <span
                          className={`rounded px-1.5 py-0.5 text-xs font-semibold ${pr.className}`}
                        >
                          {pr.label}
                        </span>
                        <span className="truncate text-xs text-slate-500">
                          {article.source}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900">
                        {article.title}
                      </p>
                      {article.titleEn && (
                        <p className="mt-1 line-clamp-1 text-sm text-slate-600">
                          {article.titleEn}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-500">
                        <span>{cat?.label}</span>
                        <span>{article.date}</span>
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </section>

        <PaneResizeHandle
          onResize={(dx) =>
            setPaneWidths((w) => ({
              ...w,
              p2: clamp(w.p2 + dx, PANE_MIN.p2, PANE_MAX.p2),
            }))
          }
        />

        {/* ペイン3: 記事 + AIアナリスト */}
        <section className="flex min-w-[240px] flex-1 flex-col bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <p className={PANE_LABEL}>ペイン3 · 記事詳細 + AIアナリスト</p>
          </div>
          {displayArticle ? (
            <>
              <article className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-sm font-semibold ${PRIORITY_STYLES[displayArticle.priority].className}`}
                  >
                    重要度：{PRIORITY_STYLES[displayArticle.priority].label}
                  </span>
                  <span className="text-sm text-slate-600">
                    {displayArticle.source} · {displayArticle.date}
                  </span>
                  {displayArticle.originalLanguage === "en" && (
                    <span className="rounded bg-indigo-100 px-2 py-0.5 text-sm font-medium text-indigo-800">
                      原文は英語
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold leading-snug text-slate-900">
                  {displayArticle.title}
                </h2>
                {displayArticle.titleEn && (
                  <p className="mt-2 text-base text-slate-600">
                    {displayArticle.titleEn}
                  </p>
                )}
                <p className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4 text-base leading-7 text-slate-800">
                  {displayArticle.summary}
                </p>
                <div className="mt-5 whitespace-pre-wrap text-base leading-7 text-slate-700">
                  {displayArticle.body}
                </div>
              </article>
              <AiAnalystPanel articleId={displayArticle.id} />
            </>
          ) : (
            <p className="p-4 text-base text-slate-600">
              記事を選択してください
            </p>
          )}
        </section>

        <PaneResizeHandle
          onResize={(dx) =>
            setPaneWidths((w) => ({
              ...w,
              p4: clamp(w.p4 - dx, PANE_MIN.p4, PANE_MAX.p4),
            }))
          }
        />

        {/* ペイン4: 分析 & X + メモ */}
        <aside
          style={{ width: paneWidths.p4 }}
          className="flex shrink-0 flex-col bg-slate-50"
        >
          <div className="border-b border-slate-200 bg-white px-3 py-2.5">
            <p className={PANE_LABEL}>ペイン4 · 分析 & X / メモ</p>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
            {insight && displayArticle ? (
              <>
                <div className="shrink-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                    要約
                  </p>
                  <p className="text-sm leading-relaxed text-slate-800">
                    {insight.analysisSummary}
                  </p>
                  <p className="mb-1 mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    業界インパクト
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {insight.industryImpact}
                  </p>
                </div>

                {aiComment && (
                  <div className="shrink-0 rounded-lg border border-blue-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                        AI
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                        業務への影響と活かし方
                      </span>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {aiComment.workTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-900"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-[15px] leading-7 text-slate-800">
                      {aiComment.workConnection}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {aiComment.focusPoints.map((point) => (
                        <li
                          key={point}
                          className="flex gap-2 text-sm leading-relaxed text-slate-700"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="shrink-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="mb-2 text-sm font-semibold text-slate-800">
                    X の反応
                  </p>
                  <ul className="space-y-3">
                    {insight.xReactions.map((post) => (
                      <li
                        key={post.handle}
                        className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                      >
                        <div className="mb-1 flex items-baseline justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-900">
                            @{post.handle}
                          </span>
                          <span className="shrink-0 text-[10px] text-slate-400">
                            ♥ {post.likes} · RT {post.retweets}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-700">
                          {post.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[10px] text-slate-400">
                    ※ モックデータ（4ヶ月目にAPI連携予定）
                  </p>
                </div>
              </>
            ) : (
              <p className="text-base text-slate-600">
                記事を選択すると分析とX反応が表示されます
              </p>
            )}

            <div className="flex min-h-0 flex-1 flex-col">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                あなたの示唆メモ
                {dbStatus === "ready" && (
                  <span className="ml-2 text-xs font-normal text-emerald-600">
                    DB 保存
                  </span>
                )}
              </p>
              <textarea
                value={currentMemo}
                onChange={(e) => {
                  if (!displayArticle) return;
                  const value = e.target.value;
                  setMemos((prev) => ({
                    ...prev,
                    [displayArticle.id]: value,
                  }));
                  scheduleMemoSave(displayArticle.id, value);
                }}
                placeholder="AIアナリストの回答を踏まえてメモ…"
                disabled={!displayArticle}
                className="min-h-[100px] flex-1 resize-none rounded-lg border border-slate-300 bg-white p-3 text-base leading-7 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
