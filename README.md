# セキュリティトレンド・デスク

情報セキュリティ・ガバナンス業務（通信事業）向けの **業務に必要な情報収集** ツール。  
セキュリティ・ガバナンス・業界ニュースを4ペインで読み、業務への接続と **自分の示唆メモ** まで残す。

---

## このツールでできること

| ペイン | 内容 |
|--------|------|
| 1 · トピック | 3本柱カテゴリ（セキュリティ全般 / ガバナンス / 業界・通信） |
| 2 · 記事一覧 | 検索、未読・重要度・メモありフィルタ、メモ優先ソート |
| 3 · 記事詳細 | 本文・要約、**AIアナリスト**（クイック質問・自由入力） |
| 4 · 分析 & メモ | 要約・業界インパクト・業務AIコメント・X反応、**示唆メモ** |

- ペイン幅はドラッグでリサイズ可能
- **示唆メモ** と **未読/既読** は Neon（PostgreSQL）に保存（`DATABASE_URL` 設定時）
- 記事・AIコメントの型はリポジトリ上のモックデータ（将来 RSS/API 連携予定）

---

## 技術スタック

- Next.js 16（App Router）
- React 19 / TypeScript
- Tailwind CSS 4
- Neon（`@neondatabase/serverless`）

---

## ローカルで動かす

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数（任意・DB 保存を使う場合）

`.env.example` をコピーして `.env.local` を作成し、Neon の接続 URL を設定する。

```bash
# .env.local
DATABASE_URL=postgresql://...
```

Vercel で Neon を追加した場合は、ダッシュボードの **Settings → Environment Variables** から `DATABASE_URL` をコピーする。

> `DATABASE_URL` 未設定でも画面は起動するが、メモ・既読はリロードで消える（セッションのみ）。

### 3. 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く。

> `ERR_CONNECTION_REFUSED` → `npm run dev` が動いているか確認（ターミナルを閉じない）。

---

## Vercel への公開

1. Vercel ダッシュボードでプロジェクトを作成（Git 連携 or CLI）
2. **Storage** から **Neon** を追加し、プロジェクトに接続
3. **Environment Variables** に `DATABASE_URL` が入っていることを確認
4. デプロイ後、公開 URL でメモ入力 → リロード → データが残ることを確認

---

## データの保存先

| データ | 保存先 | 理由 |
|--------|--------|------|
| 示唆メモ | **DB**（`user_memos`） | ユーザーが書いた記録。リロード・別端末で消えてはいけない |
| 未読/既読 | **DB**（`user_article_reads`） | 一覧フィルタと連動する自分の状態 |
| 記事マスタ | **リポジトリ**（将来 RSS） | 正はニュース/RSS 側。DB に複製しない |
| AIコメント・要約・X反応 | **リポジトリ** | 設計・型として AI と共有しやすい |
| 企画・設計 | **リポジトリ**（`docs/`） | 開発時の説明資料 |

詳細は [docs/month4-storage-plan.md](./docs/month4-storage-plan.md) を参照。

---

## プロジェクト構成

```
src/
  app/
    page.tsx              … エントリ
    api/
      user-data/          … メモ・既読の一括取得
      memos/              … メモ保存
      reads/              … 既読保存
  components/
    sectrend-desk.tsx     … 4ペイン UI
    ai-analyst-panel.tsx  … AIアナリスト
    pane-resize-handle.tsx
  data/
    mock-articles.ts      … ダミー記事15件
    article-ai-comments.ts
    article-insights.ts
  lib/
    user-data.ts          … DB 操作
    user-scope.ts         … ユーザー ID（将来認証用）
docs/
  sectrend-desk-plan.md   … 企画・実装状況
  month4-storage-plan.md  … 4ヶ月目：保存設計
scripts/
  schema.sql              … テーブル定義
```

---

## コマンド

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー（build 後） |
| `npm run lint` | ESLint |

---

## ドキュメント

| ファイル | 内容 |
|----------|------|
| [docs/sectrend-desk-plan.md](./docs/sectrend-desk-plan.md) | 企画・4ペイン・grill-me 決定ログ |
| [docs/month4-storage-plan.md](./docs/month4-storage-plan.md) | DB / リポジトリの分け方・テーブル設計 |
| [docs/references.md](./docs/references.md) | 参考リンク |

---

## 現状の制限（意図的に未実装）

- 記事の RSS/API 連携（ダミー15件）
- 本物の AI API（アナリスト・コメントはモック）
- ユーザー認証（`user_id` は `default` 固定）
- shadcn/ui 導入

---

## 図解

| 月 | 内容 | 見方 |
|----|------|------|
| 3ヶ月目 | 4ペイン UI・企画 | [diagram-sectrend-desk.surge.sh](https://diagram-sectrend-desk.surge.sh/) |
| 4ヶ月目 | 何を・どこに保存するか | https://diagram-sectrend-storage.surge.sh/ |
