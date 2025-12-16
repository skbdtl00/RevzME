import type { Metadata } from "next";
import { Anuphan } from "next/font/google";
import "./globals.css";

const anuphan = Anuphan({
  variable: "--font-anuphan",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Revz.ME Payment Gateway",
  description: "มินิมอลเกตเวย์สำหรับ Slip Verify และ TrueMoney",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="bg-slate-50 text-slate-900">
      <body className={`${anuphan.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 text-slate-900">
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
