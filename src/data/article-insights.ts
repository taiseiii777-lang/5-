export type XReaction = {
  handle: string;
  displayName: string;
  text: string;
  likes: string;
  retweets: string;
};

export type ArticleInsight = {
  analysisSummary: string;
  industryImpact: string;
  xReactions: XReaction[];
};

export const ANALYST_QUICK_QUESTIONS = [
  "業務への影響は？",
  "グループ会社への示唆は？",
  "優先度を上げるべき？",
] as const;

/** クイック質問・自由入力へのモック応答（キーワード部分一致） */
export function getAnalystMockReply(
  question: string,
  articleId: string,
): string {
  const q = question.trim();
  const insight = articleInsights[articleId];

  if (/業務|影響/.test(q)) {
    return (
      insight?.analystReplies.impact ??
      "担当領域（ポリシー・インシデント・認証）のどれに触れるかを整理し、今週の業務判断に載せられる粒度でメモすることをおすすめします。"
    );
  }
  if (/グループ|展開|会社/.test(q)) {
    return (
      insight?.analystReplies.group ??
      "本社からグループ会社への展開文書・FAQ・トレーニングのどこを更新するか、影響範囲と期限をセットで考えると実務に近づきます。"
    );
  }
  if (/優先|重要|急/.test(q)) {
    return (
      insight?.analystReplies.priority ??
      "世間の話題性だけでなく、担当通信事業・委託先・認証スケジュールとの距離で優先度を付け直すとよいです。"
    );
  }
  if (/サプライ|委託|ベンダー/.test(q)) {
    return "委託先セキュリティ管理プロセスへの影響有無を確認し、問い合わせ対応テンプレに追記できるか検討してください。";
  }
  if (/競合|他社|業界/.test(q)) {
    return "同業他社の類似対応（公表されている範囲）と比較し、自組織のガップを1行で言語化できると報告に使えます。";
  }

  return (
    insight?.analystReplies.default ??
    "記事の事実→影響範囲→自分の役割（ポリシー／インシデント／教育など）の3点で整理すると、示唆メモに転記しやすくなります。"
  );
}

type InsightWithReplies = ArticleInsight & {
  analystReplies: {
    impact: string;
    group: string;
    priority: string;
    default: string;
  };
};

export const articleInsights: Record<string, InsightWithReplies> = {
  "1": {
    analysisSummary:
      "既知脆弱性の再悪用が増加。サプライチェーン全体のパッチ状況確認が急務。",
    industryImpact: "通信インフラ系ベンダー・グループ会社への波及リスクが高い",
    xReactions: [
      {
        handle: "sec_ops_jp",
        displayName: "セキュリティオペ",
        text: "パッチ未適用の棚卸し、委託先まで含めて再確認を。再発防止チェックリストに載せる価値あり。",
        likes: "1.2k",
        retweets: "412",
      },
      {
        handle: "infosec_analyst",
        displayName: "InfoSec Analyst",
        text: "Log4j系は「終わった」扱いしがち。通信キャリアの内部システムも対象になりうる。",
        likes: "890",
        retweets: "203",
      },
    ],
    analystReplies: {
      impact:
        "担当グループ会社・委託先への影響確認リストを起こし、ポリシー上のパッチ期限と突き合わせるのが先です。",
      group:
        "展開文書に「既知脆弱性の再確認手順」を1段落足す案を、本社チームとすり合わせる材料になります。",
      priority:
        "重要度「高」のまま維持でよい。未適用資産がある場合はインシデント前の予防措置としてエスカレーション検討。",
      default: "",
    },
  },
  "2": {
    analysisSummary:
      "障害通知を装ったフィッシングが増加。ユーザー教育・社内周知の題材として即活用可能。",
    industryImpact: "サポート窓口・問い合わせ対応フローへの負荷増も想定",
    xReactions: [
      {
        handle: "phishing_watch",
        displayName: "Phishing Watch",
        text: "SaaS障害ネタはクリック率が高い。社内模擬訓練のシナリオにそのまま使える。",
        likes: "2.1k",
        retweets: "678",
      },
      {
        handle: "awareness_trainer",
        displayName: "Awareness Trainer",
        text: "「障害メール＝公式」という思い込みを崩す具体例として有効。",
        likes: "540",
        retweets: "121",
      },
    ],
    analystReplies: {
      impact:
        "トレーニング教材・FAQに追加し、問い合わせ対応マニュアルの判別ポイントを更新する流れが自然です。",
      group:
        "グループ会社向け周知テンプレに「障害装いフィッシング」章を追加する案を検討できます。",
      priority: "ユーザー向けリスクのため、今週中の周知検討でよいレベル。",
      default: "",
    },
  },
  "6": {
    analysisSummary: "ISO27001:2022移行。クラウド・脅威情報の運用実態が審査焦点。",
    industryImpact: "認証スケジュールとギャップ分析の更新タイミングに直結",
    xReactions: [
      {
        handle: "isms_consult",
        displayName: "ISMS Consultant",
        text: "2022版は「脅威インテリジェンス」の運用証跡をよく聞かれる。準備不足が露呈しやすい。",
        likes: "760",
        retweets: "198",
      },
      {
        handle: "audit_ready",
        displayName: "Audit Ready",
        text: "認証機関ごとの解釈差を早めに押さえる。社内標準との差分表が必須。",
        likes: "430",
        retweets: "89",
      },
    ],
    analystReplies: {
      impact:
        "担当会社の認証タイムラインと照合し、Annex A のギャップ一覧を今四半期のタスクに載せるのが現実的です。",
      group: "グループ展開用の「2022版対応チェックリスト」を共通化する好機です。",
      priority: "認証活動が近いほど優先度を上げる。資料化は今月中が望ましい。",
      default: "",
    },
  },
  "8": {
    analysisSummary: "企業GenAIのガバナンス枠組み。データ分類・人間レビューが要点。",
    industryImpact: "全社AI活用方針とセキュリティ統制の接点整理が必要",
    xReactions: [
      {
        handle: "ai_gov_watch",
        displayName: "AI Gov Watch",
        text: "Responsible AIは「ポリシー」より「プロセス設計」が勝負。ログ保管議論もセット。",
        likes: "1.8k",
        retweets: "521",
      },
      {
        handle: "privacy_eng",
        displayName: "Privacy Engineer",
        text: "顧客データを含むプロンプトのマスキング方針、通信事業では特に慎重に。",
        likes: "920",
        retweets: "267",
      },
    ],
    analystReplies: {
      impact:
        "AI利用ポリシーの改定論点（データ分類・ログ・レビュー）を3行サマリにまとめ、上長報告のたたきに使えます。",
      group: "グループ会社へのAIガイドライン展開ドラフトの参考になります。",
      priority: "全社方針と連動するため、中〜高で継続ウォッチ。",
      default: "",
    },
  },
  "15": {
    analysisSummary:
      "ポリシー展開は「作る」だけでなく理解度確認・問い合わせ対応までセット。",
    industryImpact: "日常業務の中核プロセスそのもの",
    xReactions: [
      {
        handle: "policy_ops",
        displayName: "Policy Ops",
        text: "展開後30日の問い合わせログが、次版改定の宝の山になる。",
        likes: "650",
        retweets: "142",
      },
    ],
    analystReplies: {
      impact:
        "ポリシー改定→展開→支援→定期レビューの一連を、自分の担当範囲でマッピングすると業務理解が深まります。",
      group: "展開計画テンプレをグループ会社ごとにカスタマイズする演習題材です。",
      priority: "担当業務の中心テーマとして常時参照でよい。",
      default: "",
    },
  },
};

export function getArticleInsight(articleId: string): ArticleInsight {
  const full = articleInsights[articleId];
  if (full) {
    return {
      analysisSummary: full.analysisSummary,
      industryImpact: full.industryImpact,
      xReactions: full.xReactions,
    };
  }
  return {
    analysisSummary: "業務関連ニュース。詳細は本文とAIコメントを参照。",
    industryImpact: "担当領域との関連をペイン4の業務タグで確認",
    xReactions: [
      {
        handle: "sec_trend_jp",
        displayName: "Sec Trend JP",
        text: "公式発表より早く、実務者の視点が出ることが多い。一次情報とセットで見る。",
        likes: "320",
        retweets: "78",
      },
    ],
  };
}
