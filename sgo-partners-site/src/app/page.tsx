"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import PhilosophyPanel from "@/components/panels/PhilosophyPanel";
import ServicesPanel from "@/components/panels/ServicesPanel";
import ContactPanel from "@/components/panels/ContactPanel";

type PanelType = "PHILOSOPHY" | "SERVICES" | "CONTACT" | null;

export default function Home() {
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const navItems: PanelType[] = ["PHILOSOPHY", "SERVICES", "CONTACT"];

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white">
      
      {/* 1. 背景画像（固定・不変） */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Image
          src="/guiding-light.png"
          alt="Guiding Light"
          fill
          className="object-cover opacity-60"
          sizes="100vw"
          priority
        />
        {/* ジェネレーティブアートの代わりのような深い光のブレンド */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />
      </div>

      {/* 2. 左〜中央エリア：巨大タイポグラフィ */}
      <motion.div 
        animate={{ 
          opacity: activePanel ? 0.05 : 1,
          scale: activePanel ? 0.95 : 1,
          filter: activePanel ? "blur(4px)" : "blur(0px)"
        }}
        transition={{ duration: 0.8 }}
        className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 md:px-24 z-10 pointer-events-none"
      >
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="font-oswald text-gray-400 tracking-[0.5em] text-[10px] md:text-xs uppercase mb-4"
        >
          Business Partner · Navigator · Mentor
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          className="font-oswald text-[12vw] md:text-[8vw] lg:text-[7vw] leading-[1.1] tracking-[0.1em] uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          SGO
          <br />
          PARTNERS
        </motion.h1>
      </motion.div>

      {/* 3. ナビゲーション（右上に完全に固定） */}
      <div className="absolute top-10 right-10 md:right-20 flex gap-10 md:gap-14 z-[100]">
        {navItems.map((item, i) => (
          <motion.button
            key={item}
            initial={{ opacity: 0, y: -20 }} 
            animate={{ 
              opacity: activePanel && activePanel !== item ? 0.2 : 1,
              y: 0 
            }}
            transition={{ delay: 0.5 + i * 0.1 }}
            onClick={() => setActivePanel(activePanel === item ? null : item)}
            className="group flex flex-col items-center"
          >
            <span className={`font-oswald text-[11px] md:text-[13px] tracking-[0.4em] uppercase transition-all duration-700 ${
              activePanel === item ? "text-red-600" : "text-white/60 group-hover:text-white"
            }`}>
              {item}
            </span>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: activePanel === item ? "100%" : "0%" }}
              className="h-[1px] bg-red-600 mt-1 group-hover:w-full transition-all duration-700"
            />
          </motion.button>
        ))}
      </div>


      {/* 4. スライドイン・パネル */}
      <AnimatePresence>
        {activePanel && (
          <>
            {/* パネル外をクリックして閉じるためのオーバーレイ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePanel(null)}
              className="absolute inset-0 z-30 bg-black/40 backdrop-blur-md"
            />

            {/* パネル本体 (右からスライドイン) - 背景をほぼ不透明にして可読性向上 */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 1 }}
              className="absolute top-0 right-0 bottom-0 w-full md:w-[65vw] lg:w-[55vw] z-[110] bg-[#050505] border-l border-white/10 shadow-[-50px_0_150px_rgba(0,0,0,0.95)]"
            >
              {activePanel === "PHILOSOPHY" && <PhilosophyPanel onClose={() => setActivePanel(null)} />}
              {activePanel === "SERVICES" && <ServicesPanel onClose={() => setActivePanel(null)} />}
              {activePanel === "CONTACT" && <ContactPanel onClose={() => setActivePanel(null)} />}
            </motion.div>

          </>
        )}
      </AnimatePresence>


    </main>
  );
}
