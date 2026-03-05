import type { Metadata } from "next";
import "./globals.css";
import TabNav from "@/components/TabNav";

export const metadata: Metadata = {
  title: "Affiliate API Tool",
  description: "Browse retailers and products from affiliate networks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen antialiased">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <h1 className="text-xl font-bold text-gray-900">Affiliate API Tool</h1>
          </div>
        </header>
        <TabNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
