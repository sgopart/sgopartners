"use client";

import { motion } from "framer-motion";

interface Props {
  onClose: () => void;
}

const services = [
  {
    title: "Strategic Branding",
    subtitle: "ブランドの本質を抽出し、未来を形作る",
    body: "本質的な強みを抽出し、市場での立ち位置を再定義。一過性の流行ではない、10年先、さらにその先にある未来を見据えたブランド基盤を構築します。視覚的な表現に留まらず、理念の言語化から一貫した世界観の具現化までをトータルでプロデュースします。",
  },
  {
    title: "Business Execution",
    subtitle: "圧倒的な実行力で、事業を完遂させる",
    body: "助言のみに留まらず、伴走する実働部隊として現場の課題を解決。起業前・新規事業の立ち上げから組織構築、異業種への挑戦、そしてフェーズの完結まで、あらゆるビジネスプロセスに深く介入し、確かな成果へと繋げます。",
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
              <p className="text-gray-400 font-light tracking-[0.12em] leading-[2.2] text-sm md:text-base border-l border-white/5 md:pl-12 pl-8 py-1 transition-all duration-700 group-hover:border-white/10 group-hover:text-gray-200">
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
