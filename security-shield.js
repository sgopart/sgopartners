/**
 * SGO Security Shield (ダイナミック・ウォーターマーク ＆ セキュリティモジュール)
 * 
 * 1. 視認性を最適化したダイナミック・ウォーターマーク (不透明度 8%、コントラスト強化)
 * 2. PC環境限定の意図的なキャプチャ・印刷検知（PrintScreen, Cmd+Shift+3/4/5, 印刷）
 *    ※スマホ環境（iOS/Android）では誤検知防止・UX向上のため検知・警告コードを完全撤廃
 * 3. スタイリッシュなトースト通知（PCのみ）
 * 4. 属性情報（IP・日時・URL・端末・解像度）の収集とログ保存（PCのみ）
 */
(function () {
  'use strict';

  // 端末/セッション固有IDの生成（または取得）
  function getSessionId() {
    let sid = sessionStorage.getItem('sgo_sec_sid');
    if (!sid) {
      sid = 'SEC-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + Date.now().toString(36).slice(-4).toUpperCase();
      sessionStorage.setItem('sgo_sec_sid', sid);
    }
    return sid;
  }

  const sessionId = getSessionId();

  // ==========================================
  // 1. ダイナミック・ウォーターマーク（視認性 8%）
  // ==========================================
  function initWatermark() {
    if (document.getElementById('sgo-watermark-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'sgo-watermark-overlay';
    overlay.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      pointer-events: none !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      z-index: 99998 !important;
      opacity: 0.08 !important;
      overflow: hidden !important;
    `;

    const canvas = document.createElement('canvas');
    canvas.width = 340;
    canvas.height = 170;
    const ctx = canvas.getContext('2d');

    function updateWatermarkPattern() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-22 * Math.PI / 180);

      const now = new Date();
      const dateStr = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

      // テキスト描画（白文字＋微細なシャドウで背景色に関わらず視認可能に）
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.font = '700 13.5px "Noto Sans JP", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('SGO PARTNERS', 0, -10);

      ctx.font = '600 11px "Noto Sans JP", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(dateStr + '  [' + sessionId + ']', 0, 11);
      ctx.restore();

      overlay.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
      overlay.style.backgroundRepeat = 'repeat';
    }

    updateWatermarkPattern();
    // 5秒毎に時刻を最新化
    setInterval(updateWatermarkPattern, 5000);

    function appendOverlay() {
      if (document.body && !document.getElementById('sgo-watermark-overlay')) {
        document.body.appendChild(overlay);
      }
    }

    if (document.body) {
      appendOverlay();
    } else {
      document.addEventListener('DOMContentLoaded', appendOverlay);
    }
  }

  // ==========================================
  // 2. 警告トースト通知 UI
  // ==========================================
  let toastCooldown = false;

  function showSecurityToast() {
    if (toastCooldown) return;
    toastCooldown = true;
    setTimeout(() => { toastCooldown = false; }, 3500); // 3.5秒間の連打防止

    // 既存トーストがあれば削除
    const existing = document.getElementById('sgo-security-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'sgo-security-toast';
    toast.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      left: 50% !important;
      transform: translateX(-50%) translateY(-25px) !important;
      background: rgba(15, 23, 42, 0.96) !important;
      color: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      border-left: 4px solid #3b82f6 !important;
      border-radius: 12px !important;
      padding: 16px 20px !important;
      max-width: 92vw !important;
      width: 500px !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(59, 130, 246, 0.25) !important;
      backdrop-filter: blur(16px) !important;
      -webkit-backdrop-filter: blur(16px) !important;
      z-index: 9999999 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Noto Sans JP", Roboto, sans-serif !important;
      opacity: 0 !important;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 6px !important;
      line-height: 1.5 !important;
      box-sizing: border-box !important;
    `;

    toast.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.96rem; color: #f8fafc; letter-spacing: 0.02em;">
          <span style="font-size: 1.15rem;">📸</span>
          <span>スクリーンショットを検知しました</span>
        </div>
        <button type="button" id="sgo-toast-close" style="background: none; border: none; color: #94a3b8; font-size: 1.3rem; cursor: pointer; padding: 0 6px; line-height: 1;" aria-label="閉じる">&times;</button>
      </div>
      <div style="font-size: 0.82rem; color: #cbd5e1; font-weight: 400; padding-top: 2px;">
        ※本サイトのコンテンツは著作権により保護されています。
      </div>
      <div style="font-size: 0.82rem; color: #93c5fd; font-weight: 500; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; margin-top: 2px;">
        <span>資料のご請求やご相談はお問い合わせフォームよりお気軽にどうぞ。</span>
        <a href="#consultation" id="sgo-toast-cta" style="color: #60a5fa; text-decoration: underline; font-weight: 600; font-size: 0.82rem; cursor: pointer;">相談フォームへ &rarr;</a>
      </div>
    `;

    document.body.appendChild(toast);

    // アニメーション表示
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // 閉じるボタン
    const closeBtn = toast.querySelector('#sgo-toast-close');
    if (closeBtn) {
      closeBtn.onclick = () => removeToast(toast);
    }

    const ctaLink = toast.querySelector('#sgo-toast-cta');
    if (ctaLink) {
      ctaLink.onclick = (e) => {
        const target = document.getElementById('consultation') || document.getElementById('contact');
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          removeToast(toast);
        }
      };
    }

    // 7秒後に自動非表示
    setTimeout(() => {
      removeToast(toast);
    }, 7000);
  }

  function removeToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-25px)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 350);
  }

  // ==========================================
  // 3. 属性収集 ＆ ログ保存
  // ==========================================
  function logSecurityEvent(triggerType) {
    const payload = {
      event: 'SCREENSHOT_DETECTED',
      trigger: triggerType,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      path: window.location.pathname,
      screenResolution: `${window.screen.width}x${window.screen.height} (dpr: ${window.devicePixelRatio || 1})`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language || navigator.userLanguage,
      userAgent: navigator.userAgent,
      referrer: document.referrer || '(direct)'
    };

    // ローカルログ退避
    try {
      const logs = JSON.parse(localStorage.getItem('sgo_security_logs') || '[]');
      logs.unshift(payload);
      if (logs.length > 50) logs.pop();
      localStorage.setItem('sgo_security_logs', JSON.stringify(logs));
    } catch (e) {}

    // サーバーログエンドポイントへ送信
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/security-log', JSON.stringify(payload));
      } else {
        fetch('/api/security-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(() => {});
      }
    } catch (e) {}

    console.info('[SGO Security Shield] Capture event recorded:', payload.sessionId, payload.trigger);
  }

  // モバイル・タッチ端末の判定
  function isMobileOrTouch() {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) ||
      window.innerWidth <= 820
    );
  }

  function handleCaptureDetected(triggerType) {
    // スマホ端末では警告・ログ処理を一切行わない
    if (isMobileOrTouch()) return;

    showSecurityToast();
    logSecurityEvent(triggerType);
  }

  // ==========================================
  // 4. イベントリスナー（PC環境限定・誤検知防止）
  // ==========================================
  function initListeners() {
    // スマホ・タッチ端末ではイベントリスナーを一切登録しない（完全撤廃）
    if (isMobileOrTouch()) return;

    // 1) PC: キーボードショートカット検知（PrintScreen / Cmd+Shift+3,4,5）
    window.addEventListener('keydown', function (e) {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        handleCaptureDetected('PC: PrintScreen Key');
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        const k = (e.key || '').toUpperCase();
        if (k === '3' || k === '4' || k === '5' || k === 'S') {
          handleCaptureDetected('PC: Screenshot Shortcut (' + k + ')');
          return;
        }
      }

      if ((e.metaKey || e.ctrlKey) && (e.key === 'p' || e.key === 'P' || e.keyCode === 80)) {
        handleCaptureDetected('PC: Print / PDF Shortcut');
      }
    }, true);

    // 2) 印刷ダイアログ検知
    window.addEventListener('beforeprint', function () {
      handleCaptureDetected('Print Dialog');
    });
  }

  // 初期化実行
  initWatermark();
  initListeners();
})();
