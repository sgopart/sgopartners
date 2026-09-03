// Google Analytics (GA4) 測定ID設定
const GA_TRACKING_ID = "G-XRDY99CY7G"; 

if (GA_TRACKING_ID && GA_TRACKING_ID !== "G-XXXXXXXXXX") {
  // 1. gtag.js の非同期読み込みスクリプトを生成して head に挿入
  const scriptEl = document.createElement('script');
  scriptEl.async = true;
  scriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(scriptEl);

  // 2. dataLayer の初期設定スクリプトを実行
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag; // 他のスクリプトからも呼び出せるようにグローバルへ公開
  
  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID, {
    send_page_view: true
  });
}
