import type { Metadata } from "next";
import { Space_Grotesk, Fraunces } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils";
import { CommandPalette } from "@/components/CommandPalette";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

const bodyFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-body" });
const displayFont = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Second Brain AI",
  description: "AI-powered personal knowledge management with capture, retrieval and grounded Q&A."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(bodyFont.variable, displayFont.variable, "bg-canvas text-ink antialiased")}>
        <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
          <Navbar />
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <Sidebar />
            <div>{children}</div>
          </div>
        </div>
        <CommandPalette />
      </body>
    </html>
  );
}
