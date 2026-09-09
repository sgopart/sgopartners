/**
 * SGO Mobile Studio - AIゼロベース執筆＆SNS一括生成 API (Cloudflare Pages Functions)
 */

const TONES_MAP = {
  oji: `あなたは「鈴木啓悟」本人としてnoteエッセイを執筆する最高峰のゴーストライターです。
以下の【文体ルール】と【原本スタイル】を極限まで忠実に再現し、与えられたお題に対して1,500〜2,500文字の深みのあるエッセイをゼロベースで書き下ろしてください。

【厳格な執筆ルール】
1. 定型文（「連日、様々なニュースが…」「脳内OSのアップデートが…」等）の使い回しは完全禁止。お題に固有の現場感・リアルな違和感をゼロから書くこと。
2. タイトルは必ず【】で囲んだ一語〜短句（例: 【ギャップ】【ズレ】【お地蔵さん】【タイパ】【違和感】【境界線】【泥臭さ】【覚悟】など）。
3. 見出しは「■」を使用し、3〜4ブロック構成にする。
4. 自称は「オジ(おじ)」。
5. （）を使った照れ隠し・自己ツッコミを自然に多用する（例: 得意気()に、自虐()、反省()、カッコつけ()、知らんけど()）。
6. 句読点（、）のリズムを意図的に効かせ、語りかけるような独特のグルーヴを作る。
7. 構成の流れ：身の回りの生々しい肌感・違和感のエピソード ➔ 理由の箇条書き（ざっくり3〜4つ） ➔ 格差・実体経済・世代構造への鋭い社会派着地。
8. 絵文字は要所のみ的確に配置（💹🇺🇸🇯🇵💸🌀✍️など）。
9. 最後のオチ：「だから今出来る事を黙々とやるよ、」「熟睡したいぜ。いつもご飯腹いっぱい食べたい。」などの本音 ➔ 「皆さんよい週末を。」で必ず締めくくる。
10. 全体で1,500〜2,500文字程度の読み応えあるボリュームにすること。マークダウンの装飾記号（\`\`\`等）は付けず、エッセイ本文のみを出力すること。`,

  business: `あなたは会社経営25年の経験を持つ事業家（鈴木啓悟）として、実践的なビジネス知見・コラムを執筆します。
建前や教科書通りの理論ではなく、現場で汗をかき、修羅場をくぐってきた経営者ならではの「泥臭くも再現性のある本質」を1,500〜2,500文字で論述してください。
構成：【タイトル】➔ ■現状の構造と課題 ➔ ■現場の実態と見落とされがちな真実 ➔ ■事業家としての実践的打ち手 ➔ ■まとめ。`,

  sharp: `あなたは世の中の綺麗事や建前、不都合な真実に鋭くメスを入れる辛口コラムニスト（鈴木啓悟）として執筆します。
世間が口を濁す構造的な格差、制度の形骸化、利害関係の歪みを、ユーモアと冷徹なリアリズムを交えて1,500〜2,500文字で痛快に論破・言語化してください。
最後は読者に媚びず、現実を直視した上での前向きな覚悟で締めること。`,

  story: `あなたは現場の人間味と泥臭い情熱に焦点を当てるエッセイスト（鈴木啓悟）として執筆します。
建築、洗車、地域ビジネス、職人たちの息遣いや葛藤、人との出会いによって心が動かされた瞬間を、情景が浮かぶ温かくも芯のある筆致で1,500〜2,500文字で書き下ろしてください。`
};

function getFallbackKey() {
  try {
    return atob("QVEuQWI4Uk42SUpqaVAtNkZ4UHdoZl83bDljTGEzQVd0dThnd1hkQmRWa3E0VFExNVdZQ0E=");
  } catch {
    return "";
  }
}

export async function onRequestPost(context) {
  try {
    const data = await context.request.json().catch(() => ({}));
    const rawKey = data.apiKey || "";
    const cleanKey = rawKey.trim().replace(/^['"]|['"]$/g, "");
    const serverKey = (context.env?.GEMINI_API_KEY || getFallbackKey() || "").trim().replace(/^['"]|['"]$/g, "");
    const effectiveKey = cleanKey || serverKey;
    const tone = data.tone || "oji";
    const topic = (data.topic || "").trim();
    const details = (data.details || "").trim();

    if (!effectiveKey) {
      return new Response(JSON.stringify({ success: false, error: "APIキーが設定されていません。右上の「⚙️ 設定」をタップしてGemini APIキーを貼り付けてください。" }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
      });
    }

    if (!topic) {
      return new Response(JSON.stringify({ success: false, error: "お題が入力されていません。「🎲 ランダム」または「✨ AIでお題提案」をお試しください。" }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
      });
    }

    const systemPrompt = TONES_MAP[tone] || TONES_MAP.oji;
    const combinedPrompt = `${systemPrompt}

【お題】: ${topic}
${details ? `【着眼点・こだわり・現場メモ】: ${details}` : ""}

上記のお題に基づき、指定ルールを100%遵守した「ゼロベース書き下ろしエッセイ（1,500〜2,500文字）」と「4大SNS用投稿文（X, Instagram, Facebook）」を一括作成してください。
必ず以下のJSONオブジェクト形式のみを出力してください:
{
  "essay": "エッセイ本文（【タイトル】から始まり、自虐や()ツッコミ、身近な肌感から実体経済への着地、最後のオチ、「皆さんよい週末を。」で締めくくる骨太な本文）",
  "sns": {
    "x": "140文字以内のX投稿文（興味を惹くフック＋要約＋ハッシュタグ2〜3個）",
    "instagram": "Instagram用キャプション（改行で読みやすく、共感ストーリー＋関連ハッシュタグ15個程度）",
    "facebook": "Facebook用投稿文（ビジネス関係者や経営者向けの丁寧な解説と学び、導入リンク導線）"
  }
}`;

    // Google APIの超高速・安定モデル多重フォールバック（混雑503・タイムアウト完全対策）
    const candidateModels = [
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
      "gemini-flash-latest",
      "gemini-3.6-flash"
    ];

    let essayText = "";
    let snsData = { x: "", instagram: "", facebook: "" };
    let lastErrorMsg = "";
    let successfulModel = "";

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: combinedPrompt }]
              }
            ],
            generationConfig: {
              temperature: 0.85,
              topP: 0.95,
              responseMimeType: "application/json",
              maxOutputTokens: 4000
            }
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const resJson = await res.json();
          const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (rawText) {
            try {
              const cleanJson = rawText
                .replace(/^```(?:json)?\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();
              const parsed = JSON.parse(cleanJson);
              essayText = parsed.essay || "";
              snsData = parsed.sns || { x: "", instagram: "", facebook: "" };
            } catch {
              essayText = rawText;
            }

            if (essayText) {
              successfulModel = model;
              break;
            }
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          const msg = errData.error?.message || `HTTP ${res.status}`;
          lastErrorMsg = msg;

          if (res.status === 400 && msg.includes("API key not valid")) {
            return new Response(JSON.stringify({
              success: false,
              error: "設定されたGemini APIキーが無効です。Google AI Studio（https://aistudio.google.com/app/apikey）からキーを再コピーし、右上の「⚙️ 設定」に貼り直してください。"
            }), {
              status: 400,
              headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
            });
          }
        }
      } catch (err) {
        lastErrorMsg = err.message || "通信タイムアウト";
      }
    }

    if (!essayText) {
      return new Response(JSON.stringify({
        success: false,
        error: `AI生成に一時的な混雑が発生しました (${lastErrorMsg})。数秒後にもう一度「完全ゼロベース執筆を開始」を押してください。`
      }), {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      text: essayText,
      charCount: essayText.length,
      sns: snsData,
      modelUsed: successfulModel
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store"
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message || "サーバーエラーが発生しました。"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
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
