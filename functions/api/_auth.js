/**
 * Cloudflare Pages Functions 認証・セッション管理ヘルパー
 * Web Crypto API による HMAC-SHA256 署名付き HttpOnly Cookie 実装
 */
const DEFAULT_SESSION_SECRET = "sgo_partners_secure_session_secret_key_32bytes_long_string_2026";
const COOKIE_NAME = "sgo_session";

export function getAdminCredentials(env) {
  return {
    email: env.ADMIN_EMAIL || "owner@example.com",
    password: env.ADMIN_PASSWORD || "admin-sgo-partner-2026!",
    secret: env.SESSION_SECRET || DEFAULT_SESSION_SECRET,
  };
}

export function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach((cookie) => {
    let [name, ...rest] = cookie.split("=");
    name = name?.trim();
    if (!name) return;
    const value = rest.join("=").trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });
  return list;
}

async function getCryptoKey(secret) {
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSignedToken(payload, secret) {
  const encoder = new TextEncoder();
  const data = JSON.stringify(payload);
  const base64Data = btoa(unescape(encodeURIComponent(data)));
  const key = await getCryptoKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(base64Data));
  const base64Sig = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${base64Data}.${base64Sig}`;
}

export async function verifySignedToken(token, secret) {
  if (!token || !token.includes(".")) return null;
  const [base64Data, base64Sig] = token.split(".");
  try {
    const encoder = new TextEncoder();
    const key = await getCryptoKey(secret);
    const sigBytes = Uint8Array.from(atob(base64Sig), (c) => c.charCodeAt(0));
    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(base64Data));
    if (!isValid) return null;
    const jsonStr = decodeURIComponent(escape(atob(base64Data)));
    const payload = JSON.parse(jsonStr);
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function authenticateAdmin(request, env) {
  const { secret } = getAdminCredentials(env);
  const cookies = parseCookies(request.headers.get("Cookie"));
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return await verifySignedToken(token, secret);
}

export function buildSessionCookie(token, maxAgeSeconds = 60 * 60 * 24 * 7) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}; Secure`;
}

export function buildClearCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`;
}
