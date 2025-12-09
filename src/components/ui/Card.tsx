import React from "react";

export default function Card({ title, children } : Readonly<{ title: string, children: React.ReactNode }>) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-stone-100">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
