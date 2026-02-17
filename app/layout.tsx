import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "BookmarkHub - Smart Bookmark Manager",
  description: "Organize and manage your bookmarks with ease. A modern, beautiful bookmark management solution.",
  keywords: ["bookmarks", "bookmark manager", "organization", "productivity"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
