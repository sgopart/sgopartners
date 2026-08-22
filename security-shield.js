/**
 * SGO Security Shield (ダイナミック・ウォーターマーク ＆ スクリーンショット検知モジュール)
 * 
 * 1. 極薄ダイナミック・ウォーターマーク (SGO PARTNERS / 日時 / 端末ID)
 * 2. スクリーンショット・印刷・画面切り取り操作のリアルタイム検知
 * 3. 高級感のあるスタイリッシュな警告トースト通知
 * 4. 属性情報（IP・日時・URL・端末・解像度）の収集とログ保存
 */
(function () {
  'use strict';

  // 端末/セッション固有IDの生成（または取得）
  function getSessionId() {
    let sid = sessionStorage.getItem('sgo_sec_sid');
    if (!sid) {
      sid = 'SEC-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
      sessionStorage.setItem('sgo_sec_sid', sid);
    }
    return sid;
  }

  const sessionId = getSessionId();

  // ==========================================
  // 1. ダイナミック・ウォーターマーク（極薄 3.8%）
  // ==========================================
  function initWatermark() {
    if (document.getElementById('sgo-watermark-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'sgo-watermark-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      user-select: none;
      -webkit-user-select: none;
      z-index: 99998;
      opacity: 0.038;
      overflow: hidden;
    `;

    const canvas = document.createElement('canvas');
    canvas.width = 380;
    canvas.height = 190;
    const ctx = canvas.getContext('2d');

    function updateWatermarkPattern() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-25 * Math.PI / 180);

      const now = new Date();
      const dateStr = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

      ctx.font = '600 13px "Noto Sans JP", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('SGO PARTNERS', 0, -10);

      ctx.font = '400 10.5px "Noto Sans JP", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(dateStr + '  [' + sessionId + ']', 0, 10);
      ctx.restore();

      overlay.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
      overlay.style.backgroundRepeat = 'repeat';
    }

    updateWatermarkPattern();
    // 10秒毎に時刻を最新化
    setInterval(updateWatermarkPattern, 10000);

    // DOMへの追加（bodyが準備でき次第）
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
    setTimeout(() => { toastCooldown = false; }, 4000); // 4秒間の連打防止

    // 既存トーストがあれば削除
    const existing = document.getElementById('sgo-security-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'sgo-security-toast';
    toast.style.cssText = `
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      background: rgba(15, 23, 42, 0.94);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-left: 4px solid #3b82f6;
      border-radius: 12px;
      padding: 16px 22px;
      max-width: 90vw;
      width: 520px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45), 0 0 25px rgba(59, 130, 246, 0.2);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Noto Sans JP", Roboto, sans-serif;
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      gap: 6px;
      line-height: 1.5;
    `;

    toast.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.98rem; color: #f8fafc; letter-spacing: 0.02em;">
          <span style="font-size: 1.15rem;">📸</span>
          <span>スクリーンショットを検知しました</span>
        </div>
        <button type="button" id="sgo-toast-close" style="background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; padding: 0 4px; line-height: 1;" aria-label="閉じる">&times;</button>
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

    // 6秒後に自動非表示
    setTimeout(() => {
      removeToast(toast);
    }, 6000);
  }

  function removeToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-20px)';
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
    } catch (e) {
      // localStorage disabled or full
    }

    // サーバーログエンドポイントへ非同期送信（存在する場合）
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

  // ==========================================
  // 4. イベントリスナー（キーボード・印刷・切り取り検知）
  // ==========================================
  function initListeners() {
    // 1) キーボードショートカット検知
    window.addEventListener('keydown', function (e) {
      // PrintScreen キー
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        handleCaptureDetected('PrintScreen Key');
        return;
      }

      // Windows: Win + Shift + S (ブラウザではShift+Sの組み合わせとして検知)
      // Mac: Cmd + Shift + 3 / 4 / 5
      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        const k = e.key.toUpperCase();
        if (k === '3' || k === '4' || k === '5' || k === 'S') {
          handleCaptureDetected('Screenshot Shortcut (' + k + ')');
          return;
        }
      }

      // 印刷・PDF保存: Ctrl + P / Cmd + P
      if ((e.metaKey || e.ctrlKey) && (e.key === 'p' || e.key === 'P' || e.keyCode === 80)) {
        handleCaptureDetected('Print / PDF Shortcut');
      }
    }, true);

    // 2) 印刷イベント検知
    window.addEventListener('beforeprint', function () {
      handleCaptureDetected('Browser Print Dialog');
    });

    // 3) 画面切り取りツール等のウィンドウフォーカス外れ検知（キー操作直後のBlur）
    let keySuspectTime = 0;
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Meta' || e.key === 'Control' || e.key === 'Alt' || e.shiftKey) {
        keySuspectTime = Date.now();
      }
    });

    window.addEventListener('blur', function () {
      if (Date.now() - keySuspectTime < 600) {
        // 直前に修飾キーが押された状態でフォーカスが外れた場合（Snipping Tool等）
        handleCaptureDetected('Snipping / Screen Capture Tool (Blur Trigger)');
      }
    });
  }

  function handleCaptureDetected(triggerType) {
    showSecurityToast();
    logSecurityEvent(triggerType);
  }

  // 初期化実行
  initWatermark();
  initListeners();
})();
