import "./globals.css";
import { DesktopSidebar } from "@/src/components/layout/sidebar/DesktopSidebar";
import Header from "@/src/components/layout/Header";
import SessionProviderWrapper from "@/src/app/auth/SessionProviderWrapper";
import { MobileSidebar } from "@/src/components/layout/sidebar/MobileSidebar";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen overflow-x-hidden">
          <aside className="hidden md:block w-64 shrink-0">
            <DesktopSidebar />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-row w-full min-w-0">
              <MobileSidebar />
              <SessionProviderWrapper>
                <Header />
              </SessionProviderWrapper>
            </div>

            <main className="flex-1 px-4 w-full min-w-0">
              <div className="w-full max-w-3xl mx-auto p-4 min-w-0">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
