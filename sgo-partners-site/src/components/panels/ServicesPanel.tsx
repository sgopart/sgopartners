"use client";

import { motion } from "framer-motion";

interface Props {
  onClose: () => void;
}

const services = [
  {
    title: "Strategic Branding",
    subtitle: "ブランドの本質を抽出し、未来を形作る",
    body: "自社の本質的な強みを抽出し、市場での立ち位置を再定義。一過性の流行ではない、5年、10年先、さらにその先にある未来を見据えたブランド基盤を構築します。\n\n【ブランディング戦略】\n幅広いニーズに柔軟に対応いたします\n\n・表現者・個人活動: アーティスト、ミュージシャン、バンド、モデル、タレント、芸術活動家\n・個人事業・フリーランス: 専門職、フリーランスなどの事業運営者様\n・店舗運営: 飲食店、衣料品店、雑貨店などの実店舗オーナー様\n・法人のお客様: 中小企業から大規模法人まで",
  },
  {
    title: "Business Execution",
    subtitle: "圧倒的な実行力で、事業を完遂させる",
    body: "助言のみに留まらず、伴走する実働部隊として現場の課題を解決。起業前・新規事業の立ち上げから組織構築、異業種への挑戦、そしてフェーズの完結まで、あらゆるビジネスプロセスに深く介入し、確かな成果へと繋げます。\n\n【事業実働支援】\n戦略策定から現場の実装までを支援\n\n・伴走型支援: 助言のみならず、実働部隊として現場課題を直接解決\n・全フェーズ対応: 起業・新規立ち上げから、組織拡充、スムーズな解体まで\n・成果へのコミット: あらゆるプロセスに介入し、確かな結果を創出",
  },
  {
    title: "Holistic Mentor",
    subtitle: "個人の成長と組織の発展を同時に実現する",
    body: "経営者やリーダーの精神的な支えとなり、多角的な視点から課題解決を導くパートナーシップ。個人の成長と組織の発展を同時に実現します。\n\n【メンタル・ストラテジスト】\nリーダーの「心」と「事業」の両輪を駆動させる\n\n・メンタリング: リーダー特有の孤独や悩みを解消する精神的支え\n・課題解決: 独自の理論と多角的な視点による本質的な意思決定支援\n・共成長: 個人のマインドセットの変化を、組織の具体的な進化へ繋げる",
  },
  {
    title: "Event Planning & Operation",
    subtitle: "感動を設計し、確かな体験を創造する",
    body: "音楽・芸能・企業のイベントからプロモーション、文化事業まで、目的達成のための最適な場をプロデュース。コンセプトの立案から現場の運営まで一貫してサポートします。\n\n【イベント企画・運営】\nコンセプト立案から現場運営まで、一気通貫したイベント制作\n\n・対応領域: 音楽・芸能イベント、企業プロモーション、文化事業\n・支援内容: 戦略的コンセプトの策定、場づくりの最適化、当日の進行・運営\n・提供価値: 目的達成に向けた「最適な場」のプロデュースと確実な現場遂行",
  },
];

export default function ServicesPanel({ onClose }: Props) {
  return (
    <div className="flex flex-col h-full w-full py-16 px-10 md:px-20 overflow-y-auto custom-scrollbar relative">
      {/* 背景装飾 */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-red-600/5 blur-[120px] pointer-events-none" />

      <div className="flex justify-between items-center mb-20 border-b border-white/10 pb-8 shrink-0 z-10">
        <div>
          <h2 className="font-oswald text-4xl tracking-[0.2em] uppercase text-white mb-2">Services</h2>
          <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase text-red-500/80">Our Expertise & Solutions</p>
        </div>
        <button 
          onClick={onClose} 
          className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-500 group"
          aria-label="Close"
        >
          <span className="block text-2xl font-light transform group-hover:rotate-90 transition-transform duration-500">×</span>
        </button>
      </div>

      <div className="flex flex-col gap-24 pb-32 z-10">
        {services.map((svc, i) => (
          <motion.div
            key={svc.title}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 relative group pl-12 md:pl-16"
          >
            {/* サービス番号を左側に配置し、重なりを回避 */}
            <div className="absolute left-0 top-0 h-full flex items-start pt-1">
              <span className="font-oswald text-4xl md:text-5xl text-white/5 tracking-tighter select-none group-hover:text-red-600/20 transition-all duration-700">
                0{i + 1}
              </span>
            </div>

            <div className="flex flex-col relative">
              <span className="font-oswald tracking-[0.4em] text-[10px] text-red-600/80 uppercase mb-2">Service 0{i + 1}</span>
              <h3 className="font-oswald text-3xl md:text-5xl tracking-[0.05em] text-white uppercase mb-2 leading-tight">
                {svc.title}
              </h3>
              <p className="text-gray-500 font-light text-xs md:text-sm tracking-[0.1em] mb-6 italic">
                — {svc.subtitle}
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 left-0 w-[2px] h-0 bg-red-600 group-hover:h-full transition-all duration-700 ease-in-out" />
              <p className="text-gray-400 font-light tracking-[0.12em] leading-[2.2] text-sm md:text-base border-l border-white/5 md:pl-12 pl-8 py-1 transition-all duration-700 group-hover:border-white/10 group-hover:text-gray-200 whitespace-pre-wrap">
                {svc.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>


      {/* フッター代わりのテキスト */}
      <div className="mt-auto pt-10 border-t border-white/5 opacity-30 select-none">
        <p className="font-oswald text-[8px] tracking-[0.5em] uppercase text-center">
          SGO Partners &copy; 2026 Strategic Management Office
        </p>
      </div>
    </div>
  );
}
