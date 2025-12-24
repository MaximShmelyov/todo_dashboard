"use client";

import { useState } from "react";
import { SidebarContent } from "./SidebarContent";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* HEADER */}
      <header className="md:hidden flex items-center p-4 bg-white shadow-sm">
        <button
          onClick={() => setOpen(true)}
          className="text-2xl"
          aria-label="Open menu"
        >
          ☰
        </button>
        <span className="ml-4 font-semibold">Menu</span>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-amber-50 border-r border-stone-200 p-6
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent onNavigate={() => setOpen(false)} />
      </aside>
    </div>
  );
}
