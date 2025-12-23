'use client'

import React from "react";

export default function VerticalListItem({ children, onClick }: { children: React.ReactNode[], onClick: () => void }) {
  return (
    <button
      className="flex justify-between items-center bg-white p-4 rounded-xl shadow border border-stone-100 hover:bg-gray-100 w-full"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
