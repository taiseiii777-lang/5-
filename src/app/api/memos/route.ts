import { NextResponse } from "next/server";
import { isDatabaseConfigured, upsertMemo } from "@/lib/user-data";

type MemoBody = {
  articleId?: string;
  content?: string;
};

export async function PUT(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL が未設定です。" },
      { status: 503 },
    );
  }

  let body: MemoBody;
  try {
    body = (await request.json()) as MemoBody;
  } catch {
    return NextResponse.json({ error: "JSON が不正です。" }, { status: 400 });
  }

  const { articleId, content } = body;
  if (!articleId || typeof content !== "string") {
    return NextResponse.json(
      { error: "articleId と content が必要です。" },
      { status: 400 },
    );
  }

  try {
    await upsertMemo(articleId, content);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PUT /api/memos]", error);
    return NextResponse.json(
      { error: "メモの保存に失敗しました。" },
      { status: 500 },
    );
  }
}
