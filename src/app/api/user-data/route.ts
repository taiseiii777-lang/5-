import { NextResponse } from "next/server";
import { fetchUserData, isDatabaseConfigured } from "@/lib/user-data";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "DATABASE_URL が未設定です。.env.local を確認してください。",
      },
      { status: 503 },
    );
  }

  try {
    const data = await fetchUserData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/user-data]", error);
    return NextResponse.json(
      { error: "ユーザーデータの読み込みに失敗しました。" },
      { status: 500 },
    );
  }
}
