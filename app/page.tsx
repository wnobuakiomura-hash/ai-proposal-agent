"use client";

import { useState } from "react";

export default function Home() {
  const [industry, setIndustry] = useState("");
  const [target, setTarget] = useState("");
  const [businessTask, setBusinessTask] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProposal("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, target, businessTask }),
      });
      const data = await res.json();
      if (data.proposal) {
        setProposal(data.proposal);
      } else {
        alert(data.error || "エラーが発生しました");
      }
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.fontFamily = "sans-serif";
    element.style.whiteSpace = "pre-wrap";
    element.style.color = "#1e293b";
    element.innerHTML = `<h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">提案書構成案</h1><div>${proposal.replace(/\n/g, "<br/>")}</div>`;

    const opt = {
  margin: 10,
  filename: `提案書_${industry || "案"}.pdf`,
  image: { type: 'jpeg' as const, quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
} as const;

    html2pdf().set(opt).from(element).save();
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">
          AI提案書自動生成エージェント
        </h1>
        <p className="text-slate-600 mb-8 text-center text-sm">
          業界や課題を入力すると、最適な提案書の構成案をAIが生成します。
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              対象の業界・業種
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="例: IT・SaaS、製造業、不動産"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              提案先のターゲット層 / 相手の部署
            </label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="例: 中小企業の経営者、人事部長"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              業務内容・現在抱えている課題
            </label>
            <textarea
              value={businessTask}
              onChange={(e) => setBusinessTask(e.target.value)}
              placeholder="例: 問い合わせ対応に時間がかかっており、AIを使った自動化を行いたい"
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-sm"
          >
            {loading ? "AIが提案書を生成中..." : "提案書を作成する"}
          </button>
        </form>

        {proposal && (
          <div className="mt-8 p-6 bg-slate-100 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-slate-800">生成された提案書構成案</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-3 rounded transition duration-200"
                >
                  {copied ? "コピーしました！" : "クリップボードにコピー"}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded transition duration-200"
                >
                  PDFでダウンロード
                </button>
              </div>
            </div>
            
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              rows={10}
              className="w-full p-4 border border-slate-300 rounded-lg text-slate-800 text-sm leading-relaxed bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-slate-500 mt-2">
              ※ 生成された文章はテキストエリア上で直接編集が可能です。
            </p>
          </div>
        )}
      </div>
    </main>
  );
}