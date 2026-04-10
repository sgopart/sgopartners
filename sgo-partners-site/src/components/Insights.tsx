"use client";

import Link from "next/link";
import Reveal from "./animations/Reveal";

const articles = [
  {
    date: "2026.04.10",
    category: "Philosophy",
    title: "「失敗」を賞賛する文化が、なぜ強い組織を作るのか。",
    excerpt: "失敗を隠す組織は、同じ過ちを繰り返す。失敗を語れる組織だけが、真に学習し、進化する。",
  },
  {
    date: "2026.03.25",
    category: "Case Study",
    title: "資金ショート寸前からV字回復。メンタルケアがもたらした突破口。",
    excerpt: "数字だけでは説明できない経営の局面が存在する。人間としての「感情」を戦略に組み込んだとき、道は開けた。",
  },
  {
    date: "2026.03.01",
    category: "News",
    title: "SGO Partners コーポレートサイトをリニューアルしました。",
    excerpt: "より多くの挑戦者たちに、私たちの存在を知ってもらうために。新しいウェブサイトを公開します。",
  },
];

export default function Insights() {
  return (
    <section id="news" className="relative py-32 md:py-40 bg-zinc-950 border-t border-white/5">
      <div className="absolute top-0 left-0 right-0 flex items-center gap-4 px-6 md:px-12 py-6">
        <span className="font-oswald text-[10px] tracking-[0.4em] text-red-600 uppercase">06 — Insights</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <Reveal>
            <h2 className="font-oswald text-5xl md:text-7xl uppercase leading-none tracking-wider text-white">
              <span className="block">Insights</span>
              <span className="block text-red-500">& News</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <Link href="#" className="font-oswald text-sm tracking-[0.3em] text-gray-400 hover:text-white uppercase border-b border-white/20 hover:border-white transition-all duration-300 pb-1">
              View All Articles →
            </Link>
          </Reveal>
        </div>

        <div className="flex flex-col gap-0 border-t border-white/5">
          {articles.map((art, i) => (
            <Reveal key={art.title} delay={i * 0.1}>
              <Link href="#" className="group border-b border-white/5 hover:border-red-600/30 transition-colors duration-300 block">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10 py-8 relative">
                  {/* 左：日付＋カテゴリ */}
                  <div className="flex md:flex-col gap-4 md:gap-1 shrink-0 md:w-36">
                    <span className="font-oswald text-gray-600 text-xs tracking-widest">{art.date}</span>
                    <span className="font-oswald text-[10px] tracking-[0.2em] text-red-500 uppercase border border-red-600/30 px-2 py-0.5 self-start">
                      {art.category}
                    </span>
                  </div>

                  {/* 中央：タイトル＋抜粋 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-white group-hover:text-glow-red transition-all duration-300 leading-snug mb-2">
                      {art.title}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-1">
                      {art.excerpt}
                    </p>
                  </div>

                  {/* 右：矢印 */}
                  <div className="hidden md:flex w-8 h-8 items-center justify-center border border-white/10 group-hover:border-red-600 group-hover:bg-red-600 transition-all duration-300 shrink-0">
                    <span className="text-white text-xs">→</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
