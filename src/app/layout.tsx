import type { Metadata } from "next";
import "./globals.css";
import { ConvexProvider } from "@/components/ConvexProvider";
import { Sidebar } from "@/components/Sidebar";
import { GlobalSearch } from "@/components/GlobalSearch";

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Nam's command center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-white">
        <ConvexProvider>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
            <GlobalSearch />
          </div>
        </ConvexProvider>
      </body>
    </html>
  );
}