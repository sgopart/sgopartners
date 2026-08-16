import { createSignedToken, getAdminCredentials, buildSessionCookie } from "../_auth.js";

export async function onRequestPost({ request, env }) {
  try {
    const { email, password } = await request.json();
    const creds = getAdminCredentials(env);

    if (!email || !password || email !== creds.email || password !== creds.password) {
      return new Response(JSON.stringify({ error: "メールアドレスまたはパスワードが正しくありません。" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = {
      email: creds.email,
      role: "admin",
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7日間有効
    };

    const token = await createSignedToken(payload, creds.secret);

    return new Response(JSON.stringify({ ok: true, user: { email: creds.email } }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": buildSessionCookie(token),
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "ログイン処理中にエラーが発生しました。" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
