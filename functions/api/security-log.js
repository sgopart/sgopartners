/**
 * SGO Security Log API
 * スクリーンショット検知・セキュリティイベントの属性ログを受信
 */
export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const clientIP = context.request.headers.get("cf-connecting-ip") || "unknown";
    const country = context.request.headers.get("cf-ipcountry") || "unknown";
    const city = context.request.headers.get("cf-ipcity") || "unknown";

    const logEntry = {
      ...data,
      serverTimestamp: new Date().toISOString(),
      clientIP: clientIP,
      geo: {
        country: country,
        city: city
      }
    };

    console.info("[SECURITY_ALERT] Screenshot / Capture detected:", JSON.stringify(logEntry));

    return new Response(JSON.stringify({ success: true, logged: true, id: logEntry.sessionId }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
