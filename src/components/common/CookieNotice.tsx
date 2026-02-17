"use client";

import Link from "next/link";
import { useState } from "react";

export default function CookieNotice() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  const dismiss = async () => {
    document.cookie = "cookie_notice_dismissed=1; Path=/; Max-Age=31536000; SameSite=Lax";
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed left-4 right-4 bottom-4 z-50 max-w-3xl mx-auto flex items-center justify-between gap-4 p-4 rounded-xl shadow-lg bg-stone-900/95 text-white border border-stone-700"
    >
      <div className="max-w-xl leading-snug">
        <div className="font-semibold mb-1">Cookies for Sign In</div>
        <div className="text-sm">
          We use cookies for authentication via Google OAuth and to protect your session. These
          cookies are required for sign-in to work.{" "}
          <Link
            href="/cookie-policy"
            className="underline text-white hover:text-blue-200 transition"
          >
            Learn more
          </Link>
          .
        </div>
      </div>
      <button
        onClick={dismiss}
        className="ml-4 px-4 py-2 rounded-lg border border-white/20 bg-white text-black font-semibold hover:bg-gray-100 transition whitespace-nowrap"
      >
        OK
      </button>
    </div>
  );
}
