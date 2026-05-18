import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jeb | Autonomous Job Scout",
  description: "Automated job scouting and resume tailoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-white dark:bg-black text-zinc-900 dark:text-zinc-100`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
        
        {/* Mobile Debug Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-red-900/90 text-[10px] text-white p-1 font-mono z-[9999] opacity-50 hover:opacity-100 transition-opacity">
          API: {process.env.NEXT_PUBLIC_API_URL || "Default"} | 
          UA: {typeof window !== "undefined" ? window.navigator.userAgent.slice(0, 50) : "Server"}
        </div>
      </body>
    </html>
  );
}
