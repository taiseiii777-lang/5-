import { neon } from "@neondatabase/serverless";
import { DEFAULT_USER_ID } from "./user-scope";

export type UserDataSnapshot = {
  memos: Record<string, string>;
  readIds: string[];
};

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL が未設定です。Vercel Storage から Neon を追加し、.env.local に接続 URL を設定してください。",
    );
  }
  return neon(url);
}

let schemaReady: Promise<void> | null = null;

export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS user_memos (
          user_id TEXT NOT NULL DEFAULT 'default',
          article_id TEXT NOT NULL,
          content TEXT NOT NULL DEFAULT '',
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (user_id, article_id)
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS user_article_reads (
          user_id TEXT NOT NULL DEFAULT 'default',
          article_id TEXT NOT NULL,
          read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (user_id, article_id)
        )
      `;
    })();
  }
  await schemaReady;
}

export async function fetchUserData(
  userId = DEFAULT_USER_ID,
): Promise<UserDataSnapshot> {
  await ensureSchema();
  const sql = getSql();

  const memoRows = await sql`
    SELECT article_id, content
    FROM user_memos
    WHERE user_id = ${userId}
  `;

  const readRows = await sql`
    SELECT article_id
    FROM user_article_reads
    WHERE user_id = ${userId}
  `;

  const memos: Record<string, string> = {};
  for (const row of memoRows) {
    memos[row.article_id as string] = row.content as string;
  }

  return {
    memos,
    readIds: readRows.map((row) => row.article_id as string),
  };
}

export async function upsertMemo(
  articleId: string,
  content: string,
  userId = DEFAULT_USER_ID,
) {
  await ensureSchema();
  const sql = getSql();

  await sql`
    INSERT INTO user_memos (user_id, article_id, content, updated_at)
    VALUES (${userId}, ${articleId}, ${content}, NOW())
    ON CONFLICT (user_id, article_id)
    DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()
  `;
}

export async function markArticleRead(
  articleId: string,
  userId = DEFAULT_USER_ID,
) {
  await ensureSchema();
  const sql = getSql();

  await sql`
    INSERT INTO user_article_reads (user_id, article_id, read_at)
    VALUES (${userId}, ${articleId}, NOW())
    ON CONFLICT (user_id, article_id)
    DO UPDATE SET read_at = NOW()
  `;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}
