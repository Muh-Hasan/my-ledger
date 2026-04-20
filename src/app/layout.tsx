import type { Metadata } from "next";
import Link from "next/link";
import { Geist_Mono, Manrope } from "next/font/google";
import { ChartColumnIncreasing } from "lucide-react";

import { cn } from "@/lib/utils";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Ledger",
  description: "Personal finance ledger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        geistMono.variable,
        "font-sans",
        manrope.variable
      )}
    >
      <body className="min-h-full text-foreground">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-30 py-4">
            <div className="flex items-center justify-between rounded-[1.75rem] border border-border bg-background/90 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-5">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <ChartColumnIncreasing className="size-5" />
                </span>
                <p className="text-base font-semibold">My Ledger</p>
              </Link>
              <span className="text-sm text-muted-foreground">Personal</span>
            </div>
          </header>
          <main className="flex-1 py-6 sm:py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
