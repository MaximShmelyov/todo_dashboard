import "./globals.css";
import {Inter} from "next/font/google";
import Sidebar from "@/src/components/layout/Sidebar";
import Header from "@/src/components/layout/Header";
import SessionProviderWrapper from "@/src/app/auth/SessionProviderWrapper";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
    <body className={`${inter.className} bg-stone-50 text-stone-800`}>
    <div className="flex min-h-screen">
      <Sidebar/>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        <SessionProviderWrapper>
          <Header/>
        </SessionProviderWrapper>

        {/* CONTENT */}
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
    </body>
    </html>
  );
}
