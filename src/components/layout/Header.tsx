"use client"

import React from "react";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Control panel</h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-stone-600">{session ? session.user?.name : "Logged out"}</span>
        <div className="w-8 h-8 rounded-full bg-stone-300"/>
      </div>
    </header>);
}