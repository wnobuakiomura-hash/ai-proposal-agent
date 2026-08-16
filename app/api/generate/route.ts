import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key",
});

export async function POST(req: Request) {
  try {
    const { industry, target, businessTask } = await req.json();

    // APIキーが未設定の場合のデモ用レスポンス（より具体的な構成）
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy_key") {
      const demoOutput = `【${industry}業界向け 提案書構成案】

1. エグゼクティブサマリー
・背景：${target}層において「${businessTask}」が喫緊の課題となっています。
・目的：業務効率化と質の向上を両立する新ソリューションの導入をご提案します。

2. 現状の課題分析
・現場の作業負荷増大と対応スピードの遅延
・手作業に依存することによるヒューマンエラーのリスク

3. 提案ソリューション
・AIを活用した業務プロセスの自動化・最適化
・システム導入後のスムーズな定着支援マニュアルの提供

4. 期待される導入効果（KPI）
・作業時間の約50%削減
・対応精度の向上および人的ミスの削減

5. 概算スケジュール＆ロードマップ
・1ヶ月目：要件定義・環境構築
・2ヶ月目：テスト運用・データ検証
・3ヶ月目：本番稼働・運用定着化`;

      return NextResponse.json({ proposal: demoOutput });
    }

    const prompt = `あなたはプロのビジネスコンサルタントです。
以下の情報をもとに、顧客に提示する高品質な提案書の構成案を作成してください。

【入力情報】
・対象業界: ${industry}
・ターゲット層/部署: ${target}
・業務内容・抱えている課題: ${businessTask}

【出力フォーマット】
以下の構成で、具体的かつ実践的な内容を出力してください。
1. エグゼクティブサマリー（課題の背景と本提案の目的）
2. 現状の課題分析（想定されるボトルネック）
3. 提案ソリューション（課題解決のための具体的アプローチ）
4. 導入効果・KPI（定量・定性効果）
5. 推進スケジュール＆次のステップ`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "あなたは優秀なビジネスコンサルタントです。" },
        { role: "user", content: prompt },
      ],
    });

    const proposal = completion.choices[0].message.content;
    return NextResponse.json({ proposal });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "提案書の生成に失敗しました。" },
      { status: 500 }
    );
  }
}