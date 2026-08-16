import { authenticateAdmin } from "../_auth.js";

export async function onRequestGet({ request, env }) {
  const session = await authenticateAdmin(request, env);
  if (!session) {
    return new Response(JSON.stringify({ authenticated: false, user: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ authenticated: true, user: { email: session.email } }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
