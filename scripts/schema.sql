-- Neon 初期スキーマ（セキュリティトレンド・デスク）
-- API 初回アクセス時にも同内容を自動実行します

CREATE TABLE IF NOT EXISTS user_memos (
  user_id TEXT NOT NULL DEFAULT 'default',
  article_id TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, article_id)
);

CREATE TABLE IF NOT EXISTS user_article_reads (
  user_id TEXT NOT NULL DEFAULT 'default',
  article_id TEXT NOT NULL,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, article_id)
);
