"use client";

import { signIn } from "next-auth/react";

import Button from "@/src/components/ui/Button";

export default function PleaseLogIn() {
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
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
        <h2 className="text-2xl font-bold mb-2">Please log in</h2>
        <p className="mb-4">You need to sign in to access this page.</p>
        <Button onClick={() => signIn("google")} className="mt-2 px-5 py-2">
          Log in with Google
        </Button>
      </div>
    </div>
  );
}
