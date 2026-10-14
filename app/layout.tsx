import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteNavigation from "@/components/site-navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocalOps",
  description: "LocalOps service management application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteNavigation />
         <div className="flex flex-1 flex-col">{children}</div>

        <footer className="border-t border-slate-200 bg-white px-6 py-5">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-1 text-center text-sm text-slate-600">
            <p>© 2026 LocalOps</p>
            <p>Service management for local businesses.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}