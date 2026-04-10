import type { Metadata } from "next";
import { Oswald, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SGO Partners | ビジネスの伴走者",
  description:
    "「成功」は語らない。失敗という最強の教科書と、最後まで走り抜くための「伴走」。SGO Partnersは起業前から立ち上げ、メンタルケアまで一貫してサポートするビジネスパートナーです。",
  keywords: ["起業支援", "ビジネスコーチング", "伴走", "経営支援", "SGO Partners"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${oswald.variable} ${notoSansJP.variable} scroll-smooth`}
    >
      <body className="bg-black text-white antialiased overflow-x-hidden selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
