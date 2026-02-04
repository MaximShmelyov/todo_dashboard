import React from "react";
import LinkButton from "@/src/components/ui/LinkButton";

export type CardAction = {
  title: React.ReactNode;
  href: string;
};

export default function Card({
  title,
  cardActions,
  children,
}: Readonly<{
  title: React.ReactNode;
  cardActions?: CardAction[];
  children: React.ReactNode;
}>) {
  return (
    <div
      className="bg-white dark:bg-stone-800
                 rounded-2xl shadow
                 dark:shadow-stone-900/60
                 p-6 border
                 border-stone-100 dark:border-stone-700"
    >
      <div className="flex flex-row justify-between">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <div className="flex flex-row justify-around">
          {cardActions &&
            cardActions.length > 0 &&
            cardActions.map((cardAction, idx) => (
              <LinkButton key={idx} href={cardAction.href}>
                {cardAction.title}
              </LinkButton>
            ))}
        </div>
      </div>
      {children}
    </div>
  );
}
