/**
 * SGO Mobile Studio - AIお題提案 API (Cloudflare Pages Functions)
 */

const PRESET_IDEAS = [
  // 💴 実体経済・格差・下請け
  { cat: "💴 実体経済・格差", topic: "物価高と下請け構造のシワ寄せ", memo: "値上げ要請が通らない零細の悲鳴。元請けと下請けの圧倒的な体力差。最後は泥臭い知恵と覚悟。" },
  { cat: "💴 実体経済・格差", topic: "大企業の賃上げ報道と、町工場の冷や汗", memo: "テレビで流れる「過去最高の大幅賃上げ」と、現場の原材料高騰。数字の上のお祭りと我々の暮らしの境界線。" },
  { cat: "💴 実体経済・格差", topic: "インボイスと中間搾取のリアル", memo: "制度の綺麗事と、現場の職人が被る事務負担と手取り減。誰も言わない不都合な真実。" },

  // 👥 世代間ギャップ・昭和オジとZ世代
  { cat: "👥 世代間ギャップ", topic: "タイパ重視のZ世代と昭和オジの温度差", memo: "倍速視聴と定時退社。合理的な若者にぐうの音も出ないオジの葛藤と、それでも残る泥臭さの価値。" },
  { cat: "👥 世代間ギャップ", topic: "「飲みニケーション」が滅びた後の現場の絆", memo: "無理強い厳禁のコンプラ時代。じゃあどうやって本音をぶつけ合い、ピンチを乗り越えるのか。" },
  { cat: "👥 世代間ギャップ", topic: "「教えてくれない」と嘆く若手と「背中を見ろ」のオジ", memo: "マニュアル至上主義と現場の勘どころ。言葉にできない暗黙知をどう伝えるかの試行錯誤。" },

  // 🛠️ 現場と職人・手触り
  { cat: "🛠️ 現場と道具", topic: "AI時代の到来と、絶対に代替されない泥臭い手触り", memo: "画面の前のスマートな効率化と、現場で油にまみれる職人技。手離れの悪さにこそ宿る利益。" },
  { cat: "🛠️ 現場と道具", topic: "一流の職人が工具を磨く理由", memo: "道具の扱いに現れる仕事の精度。トラブルを未然に防ぐ現場の所作と美学。" },
  { cat: "🛠️ 現場と道具", topic: "図面通りにいかない現場のリアル", memo: "設計図は完璧でも現場のミリ単位のズレが命取りになる。臨機応変に収める現場力。" },

  // 🏢 経営の修羅場・知恵
  { cat: "🏢 経営の修羅場", topic: "失敗という名の最強の教科書と、25年生き残った知恵", memo: "倒産危機、裏切り、痛い目を見た数々。教科書の経営論より、現場で流した冷や汗が人を育てる。" },
  { cat: "🏢 経営の修羅場", topic: "資金繰りの胃痛と、通帳を握りしめた夜", memo: "月末の支払いを前に眠れなかった若き日の記憶。経営者しか知らない孤独と覚悟。" },
  { cat: "🏢 経営の修羅場", topic: "「撤退」を決断した瞬間の静けさ", memo: "サンクコストに縛られず赤字事業を切る苦渋の決断。やめる勇気こそが会社を救う。" },

  // 🌀 世間の違和感・本音
  { cat: "🌀 世間の違和感", topic: "綺麗事だらけの正論と、生活者のリアルな肌感", memo: "テレビの景気回復ニュースと、スーパーの特売卵。数字の上のお祭りと我々の暮らしの境界線。" },
  { cat: "🌀 世間の違和感", topic: "「自己責任」という便利な免罪符", memo: "格差が広がる社会で使われる冷たい言葉。構造の問題を個人の努力不足にすり替える違和感。" },
  { cat: "🌀 世間の違和感", topic: "「何者かになりたい」SNS症候群の虚しさ", memo: "フォロワー数やキラキラ投稿を競う若者たち。現場で汗を流して1円を稼ぐ尊さの再確認。" },

  // ☕ 中年の身体と日常
  { cat: "☕ 中年の身体と日常", topic: "枯れゆく体力と、何にも代えがたい熟睡の快感", memo: "夜更かしができなくなったオジのリアル。美味しいご飯を腹いっぱい食べて泥のように眠る幸せ。" },
  { cat: "☕ 中年の身体と日常", topic: "朝の白湯と、健康診断の数値に一喜一憂する日々", memo: "若い頃は無敵だった身体が送るサイン。身体を労わりながら黙々と働く日常の愛おしさ。" },
  { cat: "☕ 中年の身体と日常", topic: "休日にふと見上げた夕暮れの空と、缶コーヒー", memo: "仕事の合間に訪れる何気ない余白。派手な娯楽より、静かな時間が染みる年齢になったオジの呟き。" },

  // 🚗 洗車ビジネス・商売の本質
  { cat: "🚗 商売の現場", topic: "たった数百円の洗車に見る、顧客感動の極意", memo: "ピカピカになった愛車を見て微笑むお客様。価格以上の価値を生み出す泥臭いこだわり。" },
  { cat: "🚗 商売の現場", topic: "繁盛店と閑古鳥の差は「排水溝の掃除」に出る", memo: "見えない裏側の衛生管理や日々の点検。細部への執着がリピーターを作る現場の法則。" },
  { cat: "🚗 商売の現場", topic: "立地論の嘘と、地域密着で愛される理由", memo: "データだけの物件選定では勝てない。生活動線と地元の空気感を肌で掴むフィールドワーク。" },

  // 🤝 人間関係・信用
  { cat: "🤝 人間関係と信用", topic: "「口約束を守る男」と「契約書で逃げる男」", memo: "トラブルの時に本性が出る。最後は書類ではなく、人間としての筋を通せるかどうかの勝負。" },
  { cat: "🤝 人間関係と信用", topic: "裏切られた時に学んだ「許す技術」", memo: "恨みや怒りにエネルギーを使う暇はない。信じた自分の未熟さを笑い飛ばして前を向く。" },
  { cat: "🤝 人間関係と信用", topic: "ピンチの時に駆けつけてくれた旧友の顔", memo: "儲かっている時に群がる人より、どん底の時に黙って手を差し伸べてくれた人の恩義。" },

  // 🎯 勝負と覚悟
  { cat: "🎯 勝負と覚悟", topic: "「石橋を叩いて渡らない」奴を置き去りにするスピード", memo: "リスクばかり気にして動けない評論家。7割の勝算で走り出す者だけが見る景色。" },
  { cat: "🎯 勝負と覚悟", topic: "自分を安売りしない値付けの勇気", memo: "相見積もりの価格競争から抜け出す方法。技術と誇りに正当な対価を求める経営姿勢。" },
  { cat: "🎯 勝負と覚悟", topic: "今できることを黙々とやる、それしかない", memo: "先行き不透明な時代に不安がっても始まらない。目の前の一人、目の前の1台に全力を尽くす。" }
];

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

    // シャッフル用ユーティリティ（Fisher-Yatesシャッフル）
    const getRandomPresets = (count = 5) => {
      const copy = [...PRESET_IDEAS];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.slice(0, count);
    };

    if (!effectiveKey) {
      return new Response(JSON.stringify({ success: true, ideas: getRandomPresets(5) }), {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
      });
    }

    const randomSeeds = [
      "現場の職人気質とデジタル化", "中小企業の資金繰りと下請けの悲哀", "昭和オジサンの生き様とZ世代の価値観",
      "商売の泥臭さとお客様の笑顔", "健康の衰えと熟睡への渇望", "世間の綺麗事と実体経済のリアル"
    ];
    const seed = randomSeeds[Math.floor(Math.random() * randomSeeds.length)];

    const prompt = `あなたは「鈴木啓悟（オジ文体エッセイスト／25年の会社経営者）」の専属企画編集者です。
今回は特に「${seed}」に関連する視点を含め、読者が思わず唸り、共感し、深く考えさせられるような「noteエッセイの切り口・お題」を【5つ】提案してください。
定型文や過去の使い回しを避け、具体的で生々しい現場のエピソードを想起させるお題にしてください。

【出力フォーマット（厳格なJSON配列のみ）】:
[
  {
    "topic": "お題のタイトル（例: 下請けいじめと綺麗事のSDGs）",
    "memo": "現場の着眼点メモ（例: 元請けのコンプラ研修と、現場に押し付けられるコスト負担。最後は泥臭い覚悟に着地。）",
    "cat": "カテゴリ名（例: 実体経済・構造）"
  }
]`;

    // 4重モデルフォールバック（超高速gemini-flash-lite-latest優先）
    const candidateModels = [
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
      "gemini-flash-latest",
      "gemini-3.6-flash"
    ];
    let ideas = [];

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.95, responseMimeType: "application/json" }
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const resData = await res.json();
          const raw = (resData.candidates?.[0]?.content?.parts?.[0]?.text || "[]")
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();
          ideas = JSON.parse(raw);
          if (Array.isArray(ideas) && ideas.length > 0) break;
        }
      } catch (err) {
        // 次のモデルへ即時フォールバック
      }
    }

    if (!Array.isArray(ideas) || ideas.length === 0) {
      ideas = getRandomPresets(5);
    }

    return new Response(JSON.stringify({ success: true, ideas }), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
    });
  } catch (e) {
    const fallbackCopy = [...PRESET_IDEAS].sort(() => 0.5 - Math.random()).slice(0, 5);
    return new Response(JSON.stringify({ success: true, ideas: fallbackCopy }), {
      status: 200,
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
