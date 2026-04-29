import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kansas Transfer — Bus traffic",
  description: "Monitoraggio del traffico autobus in Kansas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-10 border-b border-zinc-200 pb-6 dark:border-zinc-800">
            <p className="text-sm font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
              Kansas Transfer
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Bus traffic monitor
            </h1>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-16 border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            Stack: Next.js 14 · TypeScript · Tailwind · Supabase
          </footer>
        </div>
      </body>
    </html>
  );
}
