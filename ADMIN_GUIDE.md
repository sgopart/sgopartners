# SGO Partners 運営者管理画面マニュアル（ADMIN GUIDE）

SGO Partners LP・HPに届いた「無料相談」の問い合わせを閲覧・管理するための運営者専用画面です。

---

## 1. 管理画面へのアクセス情報

| 項目 | 設定内容 / URL |
| :--- | :--- |
| **管理画面URL（ローカル開発時）** | **`http://localhost:5173/admin`** |
| **管理画面URL（本番Nodeサーバー時）** | **`https://sgopartners.com/admin`** （※Nodeサーバー配信時） |
| **ログインID（メールアドレス）** | ご自身の管理者メールアドレス（環境変数 `ADMIN_EMAIL`） |
| **ログインパスワード** | ご自身で設定した強固なパスワード（環境変数 `ADMIN_PASSWORD`） |

> [!IMPORTANT]
> ログイン情報およびシークレットは、ローカルでは `.env` ファイル、本番環境では Cloudflare Pages の「Settings > Variables and Secrets」に安全に登録してください。

---

## 2. ログインID・パスワードの設定方法

`07_SGO_Partners_Full_Migration/.env` ファイル（ローカル）または Cloudflare Pages 環境変数（本番）に以下を設定してください。

```env
# 運営者ログイン用のメールアドレス
ADMIN_EMAIL=your-secure-email@sgopartners.jp

# 運営者ログイン用のパスワード（英数字記号を含む強固なもの）
ADMIN_PASSWORD=YourSecurePasswordHere!

# セッション署名用の32文字以上のランダム文字列
SESSION_SECRET=generate_your_own_32char_random_secret_here
```

---

## 3. 管理画面でできること

1. **問い合わせ一覧の確認**:
   - 受信日時順に最新のお問い合わせが一覧表示されます。
   - 未対応（赤色）、連絡済（青色）、完了（緑色）のステータスバッジで進捗が一目で分かります。
2. **問い合わせ詳細の閲覧**:
   - 会社名、お名前、メールアドレス、電話番号、従業員規模
   - 選択されたご相談テーマ、現在の状況・相談内容
   - ご希望の連絡方法、ご連絡可能な曜日・時間帯
3. **対応状況（ステータス）の更新**:
   - 「未対応（new）」「連絡済（contacted）」「完了（closed）」をドロップダウンで即座に切り替え可能。
4. **ワンクリックでのメール返信**:
   - 詳細画面下部の「メールで返信する」をクリックすると、送信者宛のメーラー（メールソフト）が自動起動します。

---

## 4. データの保存場所とバックアップ

- 問い合わせデータは `data/sgo-partners.sqlite`（SQLiteデータベース）に安全に暗号化・保存されます。
- バックアップを取る際は、`data/sgo-partners.sqlite` ファイルをコピーして保管してください。
