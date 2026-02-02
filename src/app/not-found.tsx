"use client";

import { useRouter } from "next/navigation";
import Button from "@/src/components/ui/Button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-blue-200 dark:border-stone-700">
        <svg
          className="mx-auto mb-4 w-16 h-16 text-blue-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h6M9 14h.01M15 14h.01" />
        </svg>
        <h2 className="text-2xl font-bold mb-2">Page not found</h2>
        <p className="mb-4">Sorry, the page you are looking for does not exist.</p>
        <Button onClick={() => router.push("/")} className={"mt-2 px-5 py-2"}>
          Go home
        </Button>
      </div>
    </div>
  );
}
