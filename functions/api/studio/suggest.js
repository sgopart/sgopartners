/**
 * SGO Mobile Studio - AIお題提案 API (Cloudflare Pages Functions)
 */

const PRESET_IDEAS = [
  { cat: "💴 実体経済・格差", topic: "物価高と下請け構造のシワ寄せ", memo: "値上げ要請が通らない現場の悲鳴。大手と零細の体力差。最後は泥臭い知恵と覚悟。" },
  { cat: "👥 世代間ギャップ", topic: "タイパ重視のZ世代と昭和オジの温度差", memo: "倍速視聴と定時退社。合理的な若者にぐうの音も出ないオジの葛藤と、それでも残る泥臭さの価値。" },
  { cat: "🛠️ 現場と道具", topic: "AI時代の到来と、絶対に代替されない泥臭い手触り", memo: "画面の前のスマートな効率化と、現場で油にまみれる職人技。手離れの悪さにこそ宿る利益。" },
  { cat: "🏢 経営の修羅場", topic: "失敗という名の最強の教科書と、25年生き残った知恵", memo: "倒産危機、裏切り、痛い目を見た数々。教科書の経営論より、現場で流した冷や汗が人を育てる。" },
  { cat: "🌀 世間の違和感", topic: "綺麗事だらけの正論と、生活者のリアルな肌感", memo: "テレビの景気回復ニュースと、スーパーの特売卵。数字の上のお祭りと我々の暮らしの境界線。" },
  { cat: "☕ 中年の身体と日常", topic: "枯れゆく体力と、何にも代えがたい熟睡の快感", memo: "夜更かしができなくなったオジのリアル。美味しいご飯を腹いっぱい食べて泥のように眠る幸せ。" }
];

export async function onRequestPost(context) {
  try {
    const { apiKey } = await context.request.json().catch(() => ({}));

    if (!apiKey) {
      const shuffled = [...PRESET_IDEAS].sort(() => 0.5 - Math.random()).slice(0, 5);
      return new Response(JSON.stringify({ success: true, ideas: shuffled }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const prompt = `あなたは「鈴木啓悟（オジ文体エッセイスト／25年の会社経営者）」の専属企画編集者です。
読者が思わず唸り、共感し、深く考えさせられるような「noteエッセイの切り口・お題」を【5つ】提案してください。

【出力フォーマット（厳格なJSON配列のみ）】:
[
  {
    "topic": "お題のタイトル（例: 下請けいじめと綺麗事のSDGs）",
    "memo": "現場の着眼点メモ（例: 元請けのコンプラ研修と、現場に押し付けられるコスト負担。最後は泥臭い覚悟に着地。）",
    "cat": "カテゴリ名（例: 実体経済・構造）"
  }
]`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, responseMimeType: "application/json" }
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      const parsed = JSON.parse(raw);
      return new Response(JSON.stringify({ success: true, ideas: parsed }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    throw new Error("Gemini API error");
  } catch (e) {
    const shuffled = [...PRESET_IDEAS].sort(() => 0.5 - Math.random()).slice(0, 5);
    return new Response(JSON.stringify({ success: true, ideas: shuffled }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
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
