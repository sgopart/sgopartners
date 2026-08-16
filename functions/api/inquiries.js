import { authenticateAdmin } from "./_auth.js";

const VALID_EMPLOYEE_COUNTS = ["individual", "1-5", "6-20", "21-50", "51-100", "101-plus"];

function sanitize(str = "") {
  return String(str).trim();
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const {
      fullName,
      companyName,
      email,
      employeeCount,
      topics,
      message,
      contactMethod,
      phone,
      availableHours,
      privacyAccepted,
      website,
      formStartedAt,
    } = body;

    // 1. スパムボット防御（ハニーポット & タイムチェック）
    if (website) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (formStartedAt && Date.now() - Number(formStartedAt) < 1500) {
      return new Response(JSON.stringify({ error: "送信が早すぎます。もう一度お試しください。" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. バリデーション
    if (!fullName || !companyName || !email || !employeeCount || !message || !privacyAccepted) {
      return new Response(JSON.stringify({ error: "必須項目をすべてご入力ください。" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!Array.isArray(topics) || topics.length === 0) {
      return new Response(JSON.stringify({ error: "ご相談テーマを1つ以上選択してください。" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cleanTopics = topics.map(sanitize).filter(Boolean);
    const createdAt = new Date().toISOString();

    // 3. D1 データベースへの保存（バインディングがある場合）
    let inquiryId = Date.now();
    if (env.DB) {
      // テーブルが存在しない場合は自動作成
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS consultation_inquiries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          company_name TEXT NOT NULL,
          email TEXT NOT NULL,
          employee_count TEXT NOT NULL,
          topics TEXT NOT NULL,
          message TEXT NOT NULL,
          contact_method TEXT,
          phone TEXT,
          available_hours TEXT,
          privacy_accepted INTEGER NOT NULL DEFAULT 1,
          status TEXT NOT NULL DEFAULT 'new',
          created_at TEXT NOT NULL
        )
      `).run();

      const result = await env.DB.prepare(`
        INSERT INTO consultation_inquiries (
          full_name, company_name, email, employee_count, topics,
          message, contact_method, phone, available_hours, privacy_accepted, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)
      `).bind(
        sanitize(fullName),
        sanitize(companyName),
        sanitize(email),
        employeeCount,
        JSON.stringify(cleanTopics),
        sanitize(message),
        sanitize(contactMethod) || null,
        sanitize(phone) || null,
        sanitize(availableHours) || null,
        privacyAccepted ? 1 : 0,
        createdAt
      ).run();

      if (result?.meta?.last_row_id) {
        inquiryId = result.meta.last_row_id;
      }
    }

    // 4. メール通知（FormSubmit 連携）
    try {
      await fetch("https://formsubmit.co/ajax/info@sgopartners.jp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          company: companyName,
          email: email,
          employeeCount: employeeCount,
          topics: cleanTopics.join(", "),
          message: message,
          contactMethod: contactMethod || "未指定",
          phone: phone || "未記入",
          availableHours: availableHours || "未記入",
          _subject: `【HP無料相談】${companyName} ${fullName}様より (ID: ${inquiryId})`,
        }),
      });
    } catch (e) {
      console.error("FormSubmit email notification failed", e);
    }

    return new Response(JSON.stringify({ ok: true, id: inquiryId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return new Response(JSON.stringify({ error: "送信中にエラーが発生しました。時間をおいて再度お試しください。" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestGet({ request, env }) {
  const session = await authenticateAdmin(request, env);
  if (!session) {
    return new Response(JSON.stringify({ error: "認証が必要です。" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    if (!env.DB) {
      return new Response(JSON.stringify({ inquiries: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // テーブルが存在しない場合は自動作成
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS consultation_inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        company_name TEXT NOT NULL,
        email TEXT NOT NULL,
        employee_count TEXT NOT NULL,
        topics TEXT NOT NULL,
        message TEXT NOT NULL,
        contact_method TEXT,
        phone TEXT,
        available_hours TEXT,
        privacy_accepted INTEGER NOT NULL DEFAULT 1,
        status TEXT NOT NULL DEFAULT 'new',
        created_at TEXT NOT NULL
      )
    `).run();

    const { results } = await env.DB.prepare(`
      SELECT * FROM consultation_inquiries ORDER BY created_at DESC
    `).all();

    const inquiries = (results || []).map((row) => {
      let parsedTopics = [];
      try {
        parsedTopics = JSON.parse(row.topics || "[]");
      } catch {
        parsedTopics = [row.topics];
      }
      return {
        id: row.id,
        fullName: row.full_name,
        companyName: row.company_name,
        email: row.email,
        employeeCount: row.employee_count,
        topics: parsedTopics,
        message: row.message,
        contactMethod: row.contact_method,
        phone: row.phone,
        availableHours: row.available_hours,
        status: row.status,
        createdAt: row.created_at,
      };
    });

    return new Response(JSON.stringify({ inquiries }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Inquiries fetch error:", error);
    return new Response(JSON.stringify({ error: "一覧の取得に失敗しました。" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
