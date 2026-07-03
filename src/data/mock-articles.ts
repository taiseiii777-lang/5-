export type Pillar = "security" | "governance" | "industry";
export type Priority = "high" | "medium" | "low";

export type Category = {
  id: string;
  pillar: Pillar;
  label: string;
};

export type Article = {
  id: string;
  categoryId: string;
  title: string;
  titleEn?: string;
  source: string;
  date: string;
  priority: Priority;
  unread: boolean;
  summary: string;
  body: string;
  originalLanguage?: "en" | "ja";
};

export const PILLAR_LABELS: Record<Pillar, string> = {
  security: "セキュリティ全般",
  governance: "ガバナンス・規制",
  industry: "業界・通信",
};

export const categories: Category[] = [
  { id: "vuln", pillar: "security", label: "脆弱性" },
  { id: "incident", pillar: "security", label: "インシデント事例" },
  { id: "threat", pillar: "security", label: "脅威トレンド" },
  { id: "isms", pillar: "governance", label: "ISMS / ISO" },
  { id: "privacy", pillar: "governance", label: "プライバシー" },
  { id: "ai-gov", pillar: "governance", label: "AIガバナンス" },
  { id: "mno", pillar: "industry", label: "通信 / MNO" },
  { id: "group", pillar: "industry", label: "グループ動向" },
  { id: "market", pillar: "industry", label: "市場・競合" },
];

export const articles: Article[] = [
  {
    id: "1",
    categoryId: "vuln",
    title: "Apache Log4j 系の再発注意喚起とパッチ適用状況",
    source: "JPCERT/CC",
    date: "2026-05-20",
    priority: "high",
    unread: true,
    summary:
      "既知の脆弱性を悪用した攻撃が再燃。通信インフラ系ベンダーへの影響確認が求められる。",
    body: `JPCERT/CC は、Log4j 関連コンポーネントを含む製品について、パッチ未適用システムへの攻撃報告が増加していると注意喚起しました。

通信事業者では、委託先・グループ会社を含むサプライチェーン全体での影響調査が重要です。今月は「影響範囲の洗い出し」と「緊急パッチ手順の有無」を確認する観点でキャッチアップしておくとよいでしょう。`,
    originalLanguage: "ja",
  },
  {
    id: "2",
    categoryId: "incident",
    title: "大手 SaaS 障害を装ったフィッシング増加",
    titleEn: "Phishing Surge Impersonating Major SaaS Outages",
    source: "IPA 注意喚起",
    date: "2026-05-19",
    priority: "high",
    unread: true,
    summary:
      "障害通知メールを装ったリンク誘導が増加。社内ユーザー教育の題材になりうる。",
    body: `※原文は英語（IPA 海外トレンド要約）

障害復旧を装ったメールから、偽のログインページへ誘導する手口が報告されています。グループ会社向けトレーニングの事例集に追加できる題材です。`,
    originalLanguage: "en",
  },
  {
    id: "3",
    categoryId: "threat",
    title: "ランサムウェア：初期侵入のメール経路が9割超",
    source: "業界レポート",
    date: "2026-05-18",
    priority: "medium",
    unread: true,
    summary: "メール・ID 侵害が入口。ガバナンス観点では委託先アカウント管理とセットで読む。",
    body: `最新の年次レポートでは、初期侵入の大部分がフィッシングメールまたは漏洩認証情報経由とされています。

通信事業のサポート窓口・委託先 ID の権限管理とあわせて、再発防止策のチェックリスト化が検討課題になります。`,
  },
  {
    id: "4",
    categoryId: "vuln",
    title: "Android 端末の月次セキュリティアップデート概要",
    source: "Google Security Blog",
    date: "2026-05-17",
    priority: "medium",
    unread: false,
    summary: "モバイル端末管理ポリシーと連動。エンドポイント章の復習に使える。",
    body: `モバイル OS のセキュリティパッチレベルは、MDM ポリシーで強制するケースが増えています。通信事業の端末ガバナンスを担当する場合、パッチ適用期限の社内基準と照らして読むと理解が深まります。`,
    originalLanguage: "en",
  },
  {
    id: "5",
    categoryId: "incident",
    title: "国内通信事業者：設定ミスによる情報漏えい事例",
    source: "個人情報保護委員会",
    date: "2026-05-15",
    priority: "high",
    unread: false,
    summary: "クラウドバケットの公開設定ミス。ポリシー展開・監査観点の実例。",
    body: `報告された事例では、テスト環境の設定が本番に反映され、一定期間データが外部から参照可能な状態になっていたとのことです。

インシデント管理プロセスでは「影響範囲」「再発防止」「エグゼクティブ報告」の3点が求められる典型パターンです。`,
  },
  {
    id: "6",
    categoryId: "isms",
    title: "ISO/IEC 27001:2022 移行 — 認証機関の解釈まとめ",
    source: "ISMS ナビ",
    date: "2026-05-21",
    priority: "high",
    unread: true,
    summary: "Annex A の見直し。通信事業向け認証活動の論点把握に直結。",
    body: `2022 年版への移行では、脅威インテリジェンスやクラウドサービス利用に関する管理策の運用実態が審査で問われやすくなっています。

担当グループ会社の認証スケジュールとあわせ、ギャップ分析の観点をメモしておくとよいです。`,
  },
  {
    id: "7",
    categoryId: "privacy",
    title: "個人情報の越境移転 — 新ガイドライン案のポイント",
    source: "法制ニュース",
    date: "2026-05-16",
    priority: "medium",
    unread: true,
    summary: "越境移転ルールの改正動向。プライバシーガバナンス部の必読領域。",
    body: `グループ横断でデータを扱う大規模事業者では、越境移転の契約・技術的保護措置が実務上の論点になります。改正案では同意・契約の要件が明確化される方向です。`,
  },
  {
    id: "8",
    categoryId: "ai-gov",
    title: "Responsible AI Governance Framework（草案）",
    titleEn: "Draft RAI Governance Framework for Enterprise",
    source: "NIST / 海外動向",
    date: "2026-05-14",
    priority: "high",
    unread: true,
    summary: "AI 利用のリスク分類と承認フロー。AI ガバナンス施策と接続。",
    body: `※原文は英語

企業内 GenAI 利用では、データ分類・モデル選定・人間によるレビューの3層が推奨されています。全社AI活用方針と照らし、社内ポリシーで足りない論点を洗い出す材料になる。`,
    originalLanguage: "en",
  },
  {
    id: "9",
    categoryId: "isms",
    title: "内部監査で指摘されやすい「アクセス権レビュ」不備",
    source: "監査法人ブログ",
    date: "2026-05-12",
    priority: "low",
    unread: false,
    summary: "QMS・品質マネジメントとセキュリティの接点。定期レビューの証跡が焦点。",
    body: `四半期ごとのアクセス権レビュ記録が不十分な場合、是正処置と再発防止策のセットで求められます。委託先アカウントを含むかどうかが論点になりやすいです。`,
  },
  {
    id: "10",
    categoryId: "ai-gov",
    title: "生成AI利用時のログ保管 — 国内事業者の実装例",
    source: "技術メディア",
    date: "2026-05-11",
    priority: "medium",
    unread: false,
    summary: "プロンプト・出力のログ方針。インシデント調査可能性の観点。",
    body: `ログ保管期間・マスキング・閲覧権限の3点をポリシーに落とし込む必要があります。通信事業では顧客情報を含む可能性が高いため、特に慎重な設計が求められます。`,
  },
  {
    id: "11",
    categoryId: "mno",
    title: "国内 MNO：5G 独立組織のセキュリティ基準改定",
    source: "総務省 資料",
    date: "2026-05-20",
    priority: "medium",
    unread: true,
    summary: "通信インフラの規制動向。担当事業のコンプライアンス枠組みの更新確認。",
    body: `基準改定では、サプライチェーンリスクとインシデント報告期限が明確化されています。本社・グループ会社への展開文書の改定タイミングを把握しておくとよいです。`,
  },
  {
    id: "12",
    categoryId: "group",
    title: "大規模事業者：AI活用推進とセキュリティ統制の両立",
    source: "コーポレートレポート要約",
    date: "2026-05-08",
    priority: "medium",
    unread: false,
    summary: "全社 AI 活用とセキュリティ統制の両立。日々の業務判断の材料になる。",
    body: `AI を前提とした業務設計と、セキュリティ・プライバシー統制はトレードオフではなく両立が求められます。本社ガバナンスがどこまでガードレールを提供するかが組織の役割分担の核心です。`,
  },
  {
    id: "13",
    categoryId: "market",
    title: "MVNO 市場の価格競争とセキュリティ投資のバランス",
    source: "業界ニュース",
    date: "2026-05-07",
    priority: "low",
    unread: true,
    summary: "コスト圧力下でのセキュリティ投資判断。経営報告の文脈理解用。",
    body: `エグゼクティブ向けレポートでは、投資対効果を数値で示す必要があります。インシデント未発生期間のリスク説明は難しいため、ベンチマーク・規制動向を組み合わせた説明が有効です。`,
  },
  {
    id: "14",
    categoryId: "mno",
    title: "eSIM 普及に伴う不正利用トレンド",
    source: "警察庁サイバー局",
    date: "2026-05-05",
    priority: "high",
    unread: false,
    summary: "モバイル事業固有の脅威。本人確認・再発行プロセスのガバナンスと関連。",
    body: `eSIM の再発行フローが悪用された事例が報告されています。カスタマーサポート経路の本人確認強化が再発防止策として挙げられています。`,
  },
  {
    id: "15",
    categoryId: "group",
    title: "グループ会社向けセキュリティポリシー展開のベストプラクティス",
    source: "社内想定（学習用）",
    date: "2026-05-22",
    priority: "medium",
    unread: true,
    summary: "転職後業務の核心に近いテーマ。ポリシー改定・展開・支援の進め方。",
    body: `ポリシー作成だけでなく、展開後の理解度確認・問い合わせ対応・定期レビューまでがセットです。4ペインの「示唆メモ」は、まさにこの展開計画を考える場として使えます。`,
  },
];

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id);
}
