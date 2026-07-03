# ドキュメント一覧

| ファイル | 内容 |
|----------|------|
| [sectrend-desk-plan.md](./sectrend-desk-plan.md) | 企画まとめ（grill-me）・4ペイン設計・進捗 |
| [month4-storage-plan.md](./month4-storage-plan.md) | 4ヶ月目：DB / リポジトリの分け方 |
| [diagram-storage/index.html](./diagram-storage/index.html) | 4ヶ月目：保存設計の図解ページ |
| [references.md](./references.md) | 公式リンク（shadcn/ui など） |

## 画面モックの起動

```bash
cd "c:\Users\taise\src\5月の課題"
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く。

## コードの入口

| パス | 役割 |
|------|------|
| `src/components/sectrend-desk.tsx` | 4ペインUI全体 |
| `src/data/mock-articles.ts` | ダミー記事15件 |
| `src/data/article-ai-comments.ts` | 記事ごとの業務への活かし方コメント |
