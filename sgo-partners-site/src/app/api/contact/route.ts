import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, company, email, message } = await request.json();

    // Nodemailerのトランスポーター設定 (メールサーバー設定)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || "your-email@gmail.com",
        pass: process.env.SMTP_PASS || "your-app-password",
      },
    });

    // メールの内容設定
    const mailOptions = {
      from: `"${name}" <${email}>`, // 送信者の情報
      to: process.env.CONTACT_EMAIL || "your-email@gmail.com", // あなた(SGO Partners)の受信先
      subject: `【HPお問い合わせ】${name} 様 (${company || "会社名なし"}) より`,
      text: `
SGO Partners ウェブサイトからお問い合わせがありました。

【お名前】
${name}

【会社名】
${company || "未記入"}

【メールアドレス】
${email}

【ご相談内容】
${message}
      `,
      replyTo: email, // お問い合わせした人のアドレスに返信できるようにする
    };

    // メール送信
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
