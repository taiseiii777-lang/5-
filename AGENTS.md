<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- Install with `npm ci`. Check the app with `npm run lint` and `npm run build` (TypeScript runs during the build). There is no automated test suite.
- The dev server is `npm run dev`. Next.js 16 binds `0.0.0.0:3000` by default. Hello-world: open `/`, filter a topic, open an article, click an AI analyst quick question, and type a 示唆メモ.
- `DATABASE_URL` is optional. When it is unset, `/api/user-data`, `/api/memos`, and `/api/reads` return 503, and memos plus read state stay in the browser session. The header shows `DATABASE_URL 未設定（セッションのみ）`.
- Persistence uses the Neon HTTP driver (`neon()` in `src/lib/user-data.ts`). A generic Postgres connection string does not work with that client.
