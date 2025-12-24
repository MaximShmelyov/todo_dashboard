import "./globals.css";
import {DesktopSidebar} from "@/src/components/layout/sidebar/DesktopSidebar";
import Header from "@/src/components/layout/Header";
import SessionProviderWrapper from "@/src/app/auth/SessionProviderWrapper";
import {MobileSidebar} from "@/src/components/layout/sidebar/MobileSidebar";

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
    <body className="bg-stone-50 text-stone-800">

    <div className="flex min-h-screen">
      <div>
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block w-64">
          <DesktopSidebar/>
        </aside>
      </div>

      <div className="flex-1">
        <div className="flex flex-row w-full">
          <MobileSidebar/>
          <SessionProviderWrapper>
            <Header/>
          </SessionProviderWrapper>
        </div>

        {/* MAIN */}
        <main className="flex-1 px-4">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>

    </body>
    </html>
  );
}
