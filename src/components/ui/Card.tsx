import React from "react";
import Link from "next/link";

export type CardAction = {
  title: string,
  href: string,
};

export default function Card({title, cardActions, children}: Readonly<{
  title: string,
  cardActions?: CardAction[],
  children: React.ReactNode
}>) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-stone-100">
      <div className='flex flex-row justify-between'>
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <div className='flex flex-row justify-around'>
          {cardActions && cardActions.length > 0 && cardActions.map(cardAction => (
            <Link
              key={cardAction.title}
              href={cardAction.href}
              className="rounded-xl bg-stone-100 hover:bg-stone-200 text-sm px-2 inline-flex justify-center items-center"
            >
              {cardAction.title}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
