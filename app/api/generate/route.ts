import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // どのキー名でデータが送られてきても対応できるように取得
    const industry = body.industry || "未指定";
    const target = body.target || body.targetLayer || "未指定";
    const detail = body.detail || body.issue || body.description || "未指定";

    const prompt = `あなたは優秀なビジネスコンサルタントです。
以下の情報をもとに、顧客に提出するWeb・IT活用提案書の構成案を作成してください。

【対象業界・業種】
${industry}

【提案先のターゲット層・部署】
${target}

【業務内容・現在抱えている課題】
${detail}

【出力フォーマット】
1. 課題の整理・背景
2. 提案タイトル
3. 導入による効果・メリット
4. 実施施策・ソリューション構成
5. スケジュール案`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
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