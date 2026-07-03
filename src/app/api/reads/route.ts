import { NextResponse } from "next/server";
import { isDatabaseConfigured, markArticleRead } from "@/lib/user-data";

type ReadBody = {
  articleId?: string;
};

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL が未設定です。" },
      { status: 503 },
    );
  }

  let body: ReadBody;
  try {
    body = (await request.json()) as ReadBody;
  } catch {
    return NextResponse.json({ error: "JSON が不正です。" }, { status: 400 });
  }

  const { articleId } = body;
  if (!articleId) {
    return NextResponse.json(
      { error: "articleId が必要です。" },
      { status: 400 },
    );
  }

  try {
    await markArticleRead(articleId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[POST /api/reads]", error);
    return NextResponse.json(
      { error: "既読の保存に失敗しました。" },
      { status: 500 },
    );
  }
}
