import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Vercelの環境変数からGemini APIキーを読み込み
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: Request) {
  try {
    const { industry, detail } = await req.json();

    const prompt = `あなたは優秀なビジネスコンサルタントです。
以下の情報をもとに、顧客に提出するWeb・IT活用提案書の構成案を作成してください。

【対象業界・業種】
${industry}

【課題・要望】
${detail}

【出力フォーマット】
1. 課題の整理・背景
2. 提案タイトル
3. 導入による効果・メリット
4. 実施施策・ソリューション構成
5. スケジュール案`;

    // Gemini 1.5 Flash モデルを使用して生成
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ proposal: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "提案書の生成に失敗しました。" },
      { status: 500 }
    );
  }
}