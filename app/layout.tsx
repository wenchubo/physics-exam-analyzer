import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "物理 AI 智批｜智能错题分析",
  description:
    "面向高中物理学习的智能工具，帮助学生整理错题、分析知识漏洞并生成专项练习。",
  applicationName: "物理 AI 智批",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
