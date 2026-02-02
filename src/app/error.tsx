"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/src/components/ui/Button";

export default function Error({ error }: { error: Error }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-red-200 dark:border-stone-700">
        <svg
          className="mx-auto mb-4 w-16 h-16 text-red-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
        </svg>
        <h2 className="text-2xl font-bold text-red-400 mb-2">Something went wrong</h2>
        {/*<p className="text-gray-700 dark:text-gray-300 mb-4">*/}
        {/*  {error.message || "An unexpected error occurred. Please try again later."}*/}
        {/*</p>*/}
        <Button onClick={() => router.push("/")} className={"mt-2 px-5 py-2"}>
          Go home
        </Button>
      </div>
    </div>
  );
}
