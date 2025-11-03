import "./globals.css";
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Cony",
  description: "Cony 배드민턴 플랫폼",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="overflow-x-hidden">
      <body className="flex flex-col w-full min-h-screen overflow-x-hidden max-w-screen">
        <Header />
        <main className="w-full pt-16 overflow-x-hidden sm:pt-0">
          {children}
        </main>
        <div className="hidden sm:block">
          <Footer />
        </div>
      </body>
    </html>
  );
}
