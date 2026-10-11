/**
 * SGO Mobile Studio - AIゼロベース執筆＆SNS一括生成 API (Cloudflare Pages Functions)
 */

const BASE_OJI_RULES = `あなたは「経営者オジ」本人としてnoteエッセイを執筆する最高峰のゴーストライターです。

## 1. 役割・ペルソナ
- **発信者**: 経営者オジ（事業経営25年。現場叩き上げ、元バンドマン、法人営業・実働コンサル・会社経営を全方位で経験してきたアラフィフ）。
- **ターゲット読者**: 同世代（40〜50代の経営者、営業職、現場作業員、働くオジサン・オバサン全般、日々の仕事に疲れている人）。
- **基本姿勢**: 
  - 上から目線の説教、コンサル臭、綺麗事の成功論、自社サービス・営業への誘導は【1ミリも入れない】。
  - 自らの情けなさ、見栄、愚行、加齢による衰えを赤裸々にさらし、読者に「あるある」「バカだなあ（笑）」と腹を抱えて笑ってもらう。
  - 読後感として「生きているだけで丸儲け」「明日も適当に頑張ろう」と肩の荷が下りる温かいエールで着地する。

## 2. 文体・レトリックの厳格ルール
1. **凝縮・ショート版（最重要）**:
   - 本文は【600〜850文字程度】（スマホで1分半〜2分でサクッと読める分量）。
   - 冗長な背景説明はカットし、テンポ（疾走感）とオチのキレを最優先する。
2. **比喩のハイパーインフレ**:
   - 些細な焦りや痛みを「マリアナ海溝」「ビッグバン」「スペースシャトルの打ち上げ」「関ヶ原の戦い」など大袈裟なスケールで描写する。
3. **体感とパニックの1コマ実況**:
   - 胃の痛み、冷や汗、震える指先、生まれたての子鹿のような足、太ももの幻聴バイブなど、みっともない挙動を生々しく実況する。
4. **カッコ書きの容赦ない自虐ツッコミ**:
   - (当時のわたくしの後頭部をフルスイングで殴打してやりたい)、(完全にヤバい奴である) などの自己ツッコミを自然に多用する。
5. **固有名詞の排除**:
   - 特定のアプリ名、企業名、サービス名（例：PayPay、Google、Amazon等）は原則出さず、「コード決済」「大手通販サイト」「某大手」などの一般的な表現に置き換える。

## 3. 記事構成テンプレート
1. **タイトル**:
   - 「経営者オジ、[身近な事件・やらかし・愚行]について。 [尊厳崩壊や悲哀の1文]。」
2. **導入（【キャッチーな小見出し】）**:
   - アラフィフ特有の思い込み、見栄、深夜のノリなどからスタート。
3. **事件発生とパニック実況**:
   - 見栄や油断から地獄へ突入。体内の異変や周囲の冷ややかな視線をユーモラスに描写。
4. **尊厳の崩壊とオチ**:
   - プライドをかなぐり捨てて敗走する姿を描く。
5. **まとめ＆同世代へのエール**:
   - 「無理するな」「格好つけるな」「サボれ」と優しく背中を押す。
   - 決まり文句：改行して「今日も頑張って行きましょう。そして[状況に応じたひと言]。ご苦労様でした！！」
   - ハッシュタグ（7〜10個程度。例: #経営者オジ #noteエッセイ #アラフィフ #仕事のやらかし #あるある #自虐 #ご苦労様でした 等）`;

const TONES_MAP = {
  oji: `${BASE_OJI_RULES}

【テーマ特化: オールラウンド・自虐ショートエッセイ】
特定のジャンルに縛られず、経営・現場・日常・加齢におけるオジの情けない愚行や見栄の崩壊をフルスイングで書き下ろしてください。`,

  business: `${BASE_OJI_RULES}

【テーマ特化: 経営・営業のやらかし編】
資金繰りの胃痛、月末の通帳確認、孤独な決断、IT導入の自爆、大手コンペでの背伸び・横文字自爆、理不尽な相見積もり、接待の失敗など、ビジネスの修羅場でカッコつけて大爆死したエピソードに特化して書き下ろしてください。`,

  story: `${BASE_OJI_RULES}

【テーマ特化: 現場・板挟み・駆け引き編】
建築・設備現場のトラブル、職人との駆け引き、道具への見栄、現場で通用しない綺麗すぎる企画書、元請けと下請けの板挟みの苦悩など、現場の泥臭いプライドが粉砕された瞬間に特化して書き下ろしてください。`,

  sharp: `${BASE_OJI_RULES}

【テーマ特化: 日常・加齢・健康のパニック編】
健康診断の惨劇、深夜の衝動買い（ランニングシューズ等）、レジ前のスマホ決済パニック、老眼・腰痛との意地の張り合い、休日にソワソワする奇行など、加齢による衰えに抗って敗走した生々しいパニックに特化して書き下ろしてください。`
};

export async function onRequestPost(context) {
  try {
    const data = await context.request.json().catch(() => ({}));
    const clientKey = (data.apiKey || "").trim().replace(/^['"]|['"]$/g, "");
    
    // Cloudflare 環境変数のキー名（前後のスペースを許容）から安全に取得
    let serverKey = "";
    for (const [k, v] of Object.entries(context.env || {})) {
      if (k.trim() === "GEMINI_API_KEY" && typeof v === "string") {
        serverKey = v.trim().replace(/^['"]|['"]$/g, "");
        break;
      }
    }

    // サーバー側の環境変数キー（管理画面で設定した安全な最新キー）を最優先、なければクライアントキーを使用
    const effectiveKey = serverKey || clientKey;
    const tone = data.tone || "oji";

    const topic = (data.topic || "").trim();
    const details = (data.details || "").trim();

    if (!effectiveKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "APIキーが設定されていません。CloudflareダッシュボードにGEMINI_API_KEYを設定するか、右上の「⚙️ 設定」にAPIキーを入力してください。"
      }), {
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

上記のお題と現場メモに基づき、指定の文体・構成ルールを100%遵守して、【600〜850文字程度】の完全ゼロベース書き下ろしショートエッセイを作成してください。
※noteのエディタにそのまま貼り付けられるよう、タイトルから見出し、本文、締めの言葉、ハッシュタグ（7〜10個）までを含めた完成記事として出力してください。

必ず以下のJSONオブジェクト形式のみを出力してください:
{
  "essay": "記事全文（タイトル、本文、今日も頑張って行きましょう。そして〜。ご苦労様でした！！、ハッシュタグまで含めた完全原稿）"
}`;

    // Google APIの最新・超高速モデル多重フォールバック（最新のGemini 3.6 / flash-latest系を最優先）
    const candidateModels = [
      "gemini-3.6-flash",
      "gemini-flash-latest",
      "gemini-3.8-flash",
      "gemini-flash-lite-latest",
      "gemini-3.5-flash"
    ];

    let essayText = "";
    let snsData = { x: "", instagram: "", facebook: "" };
    let lastErrorMsg = "";
    let successfulModel = "";

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

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
              maxOutputTokens: 8192
            }
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const resJson = await res.json();
          const candidate = resJson.candidates?.[0];
          const rawText = candidate?.content?.parts?.[0]?.text || "";
          if (rawText) {
            // 文字化け・生エスケープ（\uXXXX, \n, \"）の安全解除ヘルパー
            const unescapeString = (str) => {
              if (!str) return "";
              return str
                .replace(/\\n/g, "\n")
                .replace(/\\r/g, "")
                .replace(/\\t/g, "  ")
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, "\\")
                .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
            };

            // 1. 完全なJSONとしての解析
            try {
              const cleanJson = rawText
                .replace(/^```(?:json)?\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();
              const parsed = JSON.parse(cleanJson);
              if (parsed && typeof parsed.essay === "string" && parsed.essay.trim()) {
                essayText = parsed.essay.trim();
              }
            } catch {
              // 2. トークン長等で途中で切れた場合の正規表現抽出＆エスケープ解除
              const essayMatch = rawText.match(/"essay"\s*:\s*"((?:[^"\\]|\\.)*)/);
              if (essayMatch && essayMatch[1]) {
                essayText = unescapeString(essayMatch[1]).trim();
              }
            }

            // 3. それでも取れなかった場合のプレーンテキスト救出
            if (!essayText) {
              essayText = rawText
                .replace(/^```(?:text|json|markdown)?\s*/i, "")
                .replace(/\s*```$/i, "")
                .replace(/^{\s*"essay"\s*:\s*"/, "")
                .trim();
              essayText = unescapeString(essayText);
            }

            // 余計な前後引用符の除去
            if (essayText.startsWith('"') && essayText.endsWith('"')) {
              essayText = essayText.slice(1, -1).trim();
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
