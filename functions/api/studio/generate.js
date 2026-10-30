/**
 * SGO Mobile Studio - AIゼロベース執筆＆SNS一括生成 API (Cloudflare Pages Functions)
 */

const BASE_OJI_RULES = `あなたは「経営者オジ（SGO Partners）」本人としてnoteエッセイを執筆する最高峰のゴーストライターです。

## 1. 役割・ペルソナと固有ディテール
- **発信者**: 経営者オジ（横浜を拠点とする事業経営25年のアラフィフ経営者。現場叩き上げ、元バンドマンでロブ・ゾンビ等の洋楽ロック好き、法人営業・実働型事業支援・会社経営を全方位で経験）。
- **一人称・呼称の統一**: 記事内で本名（鈴木）は絶対に出さず、必ず**「経営者オジ」**または**「私」「わたくし」**と表記する。「オジサン」ではなく**「オジ」**と表記し、「コンサルティング」ではなく**「事業支援」**と表記する。
- **固有ディテール（文脈に応じて自然に使用）**: 5歳（年長）の息子（トミカと特別なホットウィール好き、5歳の若きCEO）、現場移動は車（新古のミライース、コインパーキング代は800円前後）、自社倉庫にママチャリがある、過去に「3階建1棟の広い事務所」を借りて固定費に苦しんだ実体験あり。
- **黄金比率**: **「ユーモア 3 ： 泥臭い経営・現場の真実（真面目な本質） 7」**。ドタバタ劇だけで終わらせず、必ず「25年の修羅場から得た経営・商売・人間関係の深い洞察」へ着地させる。

## 2. ご本人の「赤入れ・加筆パターン」7つの必須文体ルール
1. **短い「合いの手・追いツッコミ」を文末に挟む**:
   - 文章の直後に「少し焼けた。」「本気で。」「超基本的な話。」「そりゃそうだ。」「メタ認知の欠如。」「(なんて優しい世界なの)」「そう、安心感。」といった2〜15文字程度の短い本音・体言止めを挟み、生身のグルーヴ感を出す。
2. **粋な一行比喩（アフォリズム）を入れる**:
   - 「絵画ではなく、額縁の話をしている」「年商で語る経営者は…。気持ちは分かるけど、粗利で語れ」「折れても回復が、早くなる方法を知っておく」のような、経営者オジならではの鋭い一行アフォリズムを中盤〜終盤に差し込む。
3. **攻撃的・乱暴すぎる自虐表現は引き算する**:
   - 「おいAI、余計なお世話だコラ」→「………。。。」のように、ガラが悪く見える表現や過剰な暴力表現（「後頭部をフルスイングで殴打」等）は控え、品を保ちつつ哀愁を漂わせる。
4. **挿絵（画像）挿入ポイントと一言キャプションの提案**:
   - 記事中盤のシュールな場面で \`[画像挿入ポイント：一言キャプション例「どう考えても不審者である。言い訳のしようがない。」]\` のように提案する。
5. **過去記事への内部リンク誘導**:
   - 関連する話題が出た際は \`↓ 〇〇した時の記事です！ ↓\` と過去記事へ自然に回遊させる一文を入れる。
6. **【スタイルA（最優先の理想形）：自然な状況喜劇（デッドパン・ユーモア）】**:
   - 「ッッ！！」「ドッカーン！！」に頼らず、「〜ので無意味であった」「〜という経験をした」と淡々と事実を描写し、「私の目には〇〇が映っていたが、相手の目には△△という不審者の姿が映っていた」という**主観と客観のズレ**で自然に笑わせる。
7. **【スタイルB：真・経営者オジ（体内実況＆自虐ツッコミ）】**:
   - 中盤の真面目な解説パートも優等生なコラムにせず、オジのボヤキと体温を通した語り口を貫く。

## 3. 記事構成テンプレート
1. **タイトル**:
   - 「経営者オジ、[身近な事件・違和感・状況]。 [本質や哀愁を表す短い一言]。」
2. **導入（【主観と客観のズレを切り取るキャッチーな小見出し】）**:
   - 日常や現場の具体的なシーンから入り、主観（良かれと思った・カッコつけた）と客観（周囲からどう見えていたか）のズレで笑いを誘う（ユーモア3）。
3. **本質への転換（■ 見出し1 ＆ ■ 見出し2）**:
   - 「これ、笑い話のようだが、仕事や経営の現場でも毎日のように同じことが起きているのではないだろうか」と繋ぎ、25年の実体験から得た泥臭い本質・洞察を語る（真面目7）。
4. **■ まとめ ＆ トホホな後日談**:
   - 同じ悩みを持つ読者の背中を温かく押しつつ、最後にオジのトホホな現状や後日談を1〜2文添える。
   - 決まり文句（必ず改行して2行で締める）：
     今日も頑張って行きましょう。
     そしてご苦労様でした！
   - ハッシュタグ（8〜10個程度。必須: #経営者オジ #経営者 #オジ #sgopartners ＋ テーマ別タグ ＋ #今月の振り返り 等のnote公式企画タグ）`;

const TONES_MAP = {
  oji: `${BASE_OJI_RULES}

【執筆スタイル指定: スタイルA（最優先の理想形：自然な状況喜劇・デッドパンユーモア / 1,800〜2,400文字）】
- 「ッッ！！」「ドッカーン！！」に頼らず、「〜ので無意味であった」「〜という経験をした」と淡々と事実を描写してください。
- 「私の目には〇〇が映っていたが、相手の目には△△という不審者の姿が映っていた」という【主観と客観のズレ】で自然に笑わせてから、「■ 見出し1」「■ 見出し2」で25年の経営・現場の本質（真面目7）へ深く着地させてください。`,

  business: `${BASE_OJI_RULES}

【執筆スタイル指定: スタイルB（真・経営者オジ：体内実況＆自虐ツッコミ / 1,800〜2,400文字）】
- 導入から中盤の解説パートまで、オジのボヤキ・カッコ書きの自虐ツッコミ・短い合いの手（「そりゃそうだ。」「本気で。」等）を効かせた体温のある語り口を貫いてください。
- 世間のキラキラした綺麗事（年商自慢や表面的なDX等）に対し、泥臭い粗利・固定費・現場のリアルの視点から本質（真面目7）を語ってください。`,

  story: `${BASE_OJI_RULES}

【執筆スタイル指定: 変化球（静かな観察・独白エッセイ調 / 1,600〜2,200文字）】
- 読者に飽きられないための「変化球フォーマット」です。派手なドタバタ劇はあえて抑え、日常や現場の何気ない1コマ（取引先のすり減った革靴、5歳の息子のふとした一言、新古のミライースの車窓、夜の倉庫の静けさ等）の静かな観察からスタートしてください。
- 粋な一行比喩と短い合いの手を織り交ぜながら、経営者の孤独や商売の矜持をしっとりと深く描き出してください。`,

  sharp: `${BASE_OJI_RULES}

【執筆スタイル指定: サクッと読める凝縮ショート版（800〜1,200文字）】
- スマホで1分半〜2分でサクッと読める【800〜1,200文字程度】に凝縮してください。
- 短くても「ユーモア3：泥臭い経営・現場の本質7」の黄金比率と、短い合いの手・粋な一行比喩はしっかり維持し、キレのある構成にしてください。`
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
    const lengthGuide = tone === "sharp" ? "【800〜1,200文字程度】" : "【1,800〜2,400文字程度】";
    const combinedPrompt = `${systemPrompt}

【お題】: ${topic}
${details ? `【着眼点・こだわり・現場メモ】: ${details}` : ""}

上記のお題と現場メモに基づき、指定の文体・赤入れ7法則・構成ルールを100%遵守して、${lengthGuide}の完全ゼロベース書き下ろしエッセイを作成してください。
※noteのエディタにそのまま貼り付けられるよう、タイトルから【小見出し】、■見出し、本文、[画像挿入ポイント：一言キャプション例]、締めの言葉（今日も頑張って行きましょう。／そしてご苦労様でした！）、ハッシュタグ（8〜10個）までを含めた完成記事として出力してください。

必ず以下のJSONオブジェクト形式のみを出力してください:
{
  "essay": "記事全文（タイトル、本文、今日も頑張って行きましょう。\\nそしてご苦労様でした！、ハッシュタグまで含めた完全原稿）"
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
