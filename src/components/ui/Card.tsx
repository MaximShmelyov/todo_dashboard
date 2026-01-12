import React from "react";
import LinkButton from "@/src/components/ui/LinkButton";

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
            <LinkButton
              key={cardAction.title}
              href={cardAction.href}
            >
              {cardAction.title}
            </LinkButton>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
