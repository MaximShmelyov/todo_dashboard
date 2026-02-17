import "./globals.css";
import { cookies } from "next/headers";

import SessionProviderWrapper from "@/src/app/auth/SessionProviderWrapper";
import CookieNotice from "@/src/components/common/CookieNotice";
import Header from "@/src/components/layout/Header";
import { DesktopSidebar } from "@/src/components/layout/sidebar/DesktopSidebar";
import { MobileSidebar } from "@/src/components/layout/sidebar/MobileSidebar";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const dismissed = (await cookies()).get("cookie_notice_dismissed")?.value === "1";

  return (
    <html lang="en">
      <body>
        <div className="flex w-full min-h-screen overflow-x-hidden">
          <DesktopSidebar />

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
        {!dismissed && <CookieNotice />}
      </body>
    </html>
  );
}
