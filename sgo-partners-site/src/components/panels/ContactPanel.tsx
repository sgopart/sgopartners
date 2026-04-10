"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onClose: () => void;
}

export default function ContactPanel({ onClose }: Props) {
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSent(true);
      } else {
        throw new Error("送信に失敗しました。時間をおいて再度お試しください。");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "予期せぬエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full py-16 px-10 md:px-20 overflow-y-auto custom-scrollbar relative">
      {/* 装飾用：右上のぼんやりとしたグロー */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] pointer-events-none" />

      <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-6 shrink-0 z-10">
        <div>
          <h2 className="font-oswald text-4xl tracking-[0.2em] uppercase text-white mb-2">Contact</h2>
          <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Get in touch with us</p>
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="w-full max-w-lg mx-auto z-10"
      >
        {sent ? (
          <div className="text-center py-20 bg-white/[0.02] backdrop-blur-sm border border-white/5 p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-30" />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="text-red-500 font-oswald text-6xl mb-6 relative"
            >
              ✓
            </motion.div>
            <h3 className="font-light text-xl text-white tracking-[0.1em] mb-4 relative">メッセージを送信しました</h3>
            <p className="text-gray-400 font-light tracking-[0.05em] text-sm leading-[2.2] relative">
              お問い合わせありがとうございます。<br />内容を確認の上、担当者よりご連絡いたします。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex flex-col gap-3 group">
                <label className="font-oswald text-[11px] tracking-[0.4em] text-red-600/60 uppercase group-focus-within:text-red-500 transition-colors">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="FULL NAME"
                    className="w-full bg-transparent border-b border-white/10 focus:border-red-600 outline-none px-0 py-4 text-white placeholder-white/5 text-sm font-light tracking-[0.2em] transition-all duration-700"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-red-600 group-focus-within:w-full transition-all duration-700" />
                </div>
              </div>

              <div className="flex flex-col gap-3 group">
                <label className="font-oswald text-[11px] tracking-[0.4em] text-red-600/60 uppercase group-focus-within:text-red-500 transition-colors">
                  Company
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="COMPANY (OPTIONAL)"
                    className="w-full bg-transparent border-b border-white/10 focus:border-red-600 outline-none px-0 py-4 text-white placeholder-white/5 text-sm font-light tracking-[0.2em] transition-all duration-700"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-red-600 group-focus-within:w-full transition-all duration-700" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 group">
              <label className="font-oswald text-[11px] tracking-[0.4em] text-red-600/60 uppercase group-focus-within:text-red-500 transition-colors">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="EMAIL@DOMAIN.COM"
                  className="w-full bg-transparent border-b border-white/10 focus:border-red-600 outline-none px-0 py-4 text-white placeholder-white/5 text-sm font-light tracking-[0.2em] transition-all duration-700"
                />
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-red-600 group-focus-within:w-full transition-all duration-700" />
              </div>
            </div>

            <div className="flex flex-col gap-3 group">
              <label className="font-oswald text-[11px] tracking-[0.4em] text-red-600/60 uppercase group-focus-within:text-red-500 transition-colors">
                Your Message
              </label>
              <div className="relative">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  placeholder="DESCRIBE YOUR INQUIRY..."
                  className="w-full bg-transparent border-b border-white/10 focus:border-red-600 outline-none px-0 py-4 text-white placeholder-white/5 text-sm font-light tracking-[0.1em] leading-relaxed transition-all duration-700 resize-none"
                />
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-red-600 group-focus-within:w-full transition-all duration-700" />
              </div>
            </div>

            <div className="flex flex-col gap-8 mt-4">
              <p className="text-[10px] text-gray-500 leading-relaxed font-light tracking-[0.05em]">
                * お送りいただいた情報は、お問い合わせへの回答および弊社のサービス向上目的のみに使用し、個人情報保護方針に基づき適切に管理いたします。
              </p>

              {error && <p className="text-red-500 text-xs font-light italic">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="relative group overflow-hidden font-oswald tracking-[0.5em] text-xs px-12 py-6 bg-white text-black hover:text-white transition-all duration-700 uppercase w-full disabled:opacity-50"
              >
                <span className="relative z-10">{loading ? "SENDING..." : "SEND MESSAGE"}</span>
                <div className="absolute inset-0 bg-red-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]" />
              </button>
            </div>
          </form>

        )}
      </motion.div>
    </div>
  );
}
