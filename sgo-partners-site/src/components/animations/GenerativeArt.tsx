"use client";

import { useEffect, useRef } from "react";

export default function GenerativeArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth ?? window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight ?? 400;
    };
    resize();
    window.addEventListener("resize", resize);

    // 導きの白い光が交差するような演出
    let t = 0;
    let raf: number;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      // フェードアウト（残像トレイル）
      ctx.fillStyle = "rgba(0,0,0,0.02)";
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;

      for (let i = 0; i < 2; i++) {
        const phase = i === 0 ? 0 : Math.PI;
        const amp = H * 0.15;
        const freq = 0.008;
        const speed = 0.3;

        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
          const progress = x / W;
          const y = cy + Math.sin(x * freq + t * speed + phase) * amp * Math.sin(progress * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const alpha = i === 0 ? 0.7 : 0.4;
        
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = i === 0 ? 1.5 : 0.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(255,255,255,1)`;
        ctx.stroke();
      }

      t += 0.015;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
