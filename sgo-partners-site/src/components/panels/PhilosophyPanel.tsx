"use client";

import { motion } from "framer-motion";

interface Props {
  onClose: () => void;
}

export default function PhilosophyPanel({ onClose }: Props) {
  return (
    <div className="flex flex-col h-full w-full py-16 px-10 md:px-20 overflow-y-auto custom-scrollbar relative">
      {/* 背景装飾 */}
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-red-600/5 blur-[120px] pointer-events-none" />

      <div className="flex justify-between items-center mb-20 border-b border-white/10 pb-8 shrink-0 z-10">
        <div>
          <h2 className="font-oswald text-4xl tracking-[0.2em] uppercase text-white mb-2">Philosophy</h2>
          <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase text-red-500/80">Our Vision & Core Values</p>
        </div>
        <button 
          onClick={onClose} 
          className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-500 group"
          aria-label="Close"
        >
          <span className="block text-2xl font-light transform group-hover:rotate-90 transition-transform duration-500">×</span>
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-16 z-10 max-w-2xl"
      >
        <div className="flex flex-col gap-4">
          <span className="font-oswald tracking-[0.5em] text-[10px] text-red-600 uppercase">Mission Statement</span>
          <h3 className="text-white text-2xl md:text-3xl tracking-[0.15em] font-medium leading-relaxed">
            ～事業を深化させ、確かな未来へ～
          </h3>
        </div>

        <div className="flex flex-col gap-10 text-gray-400 tracking-[0.1em] font-light leading-[2.4] text-sm md:text-lg border-l border-white/5 pl-8 py-2">
          <p>
            戦略策定から現場の実働支援まで。<br />
            SGO Partners は、挑戦する皆様と「並走」し、本質的な価値を形にする総合事業支援パートナーです。
          </p>

          <p className="relative">
            <span className="text-white/80 font-medium">「成功」は語らない。</span><br />
            私たちが共有するのは、失敗という最強の教科書と、最後まで走り抜くための「伴走」です。
          </p>

          <p>
            鈴木総合事務所を母体とし、積み上げられた専門知識と現場感覚を融合。貴社の挑戦に限界を設けず、その先に待つ景色を共に見据えます。
          </p>
        </div>

        <div className="flex gap-4 mt-8">
          <div className="h-px w-20 bg-red-600 mt-3" />
          <p className="font-oswald text-xs tracking-[0.3em] text-white/50 uppercase">
            Suzuki General Office<br />
            SGO Partners
          </p>
        </div>
      </motion.div>

      {/* 装飾用テキスト */}
      <div className="absolute bottom-10 right-10 rotate-90 origin-right opacity-5 pointer-events-none select-none">
        <span className="font-oswald text-7xl tracking-[0.2em] uppercase text-white">DEEPEN</span>
      </div>
    </div>
  );
}
