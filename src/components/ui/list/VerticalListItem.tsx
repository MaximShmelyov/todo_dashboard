import React from "react";

export default function VerticalListItem({ children }: { children: React.ReactNode[] }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow border border-stone-100">
      {children}
    </div>
  );
}
