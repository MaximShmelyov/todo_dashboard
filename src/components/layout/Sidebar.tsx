import Link from "next/link";
import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-amber-50 border-r border-stone-200 p-6">
      <Link href="/" className="text-2xl font-semibold">🏠 Home</Link>
      <nav className="flex flex-col gap-2 mt-8">
        <Link className="px-3 py-2 rounded-lg hover:bg-amber-100" href="/shopping">🛍 Shopping</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-amber-100" href="/notes">📝 Notes</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-amber-100" href="/todos">✔️ Todos</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-amber-100" href="/family">👪 Family</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-amber-100" href="/settings">⚙️ Settings</Link>
      </nav>

      {/*<div className="mt-auto pt-6 border-t border-stone-200">*/}
      {/*  <div className="text-sm text-stone-600">User</div>*/}
      {/*</div>*/}
    </aside>
  );
}