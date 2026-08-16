import { authenticateAdmin } from "../_auth.js";

const ALLOWED_STATUS = ["new", "contacted", "closed"];

export async function onRequestPatch({ params, request, env }) {
  const session = await authenticateAdmin(request, env);
  if (!session) {
    return new Response(JSON.stringify({ error: "認証が必要です。" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "IDが指定されていません。" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { status } = await request.json();
    if (!ALLOWED_STATUS.includes(status)) {
      return new Response(JSON.stringify({ error: "不正なステータスです。" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (env.DB) {
      await env.DB.prepare(`
        UPDATE consultation_inquiries SET status = ? WHERE id = ?
      `).bind(status, id).run();
    }

    return new Response(JSON.stringify({ ok: true, id, status }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Status update error:", error);
    return new Response(JSON.stringify({ error: "ステータスの更新に失敗しました。" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
