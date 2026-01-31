"use client";

import React from "react";
import Link from "next/link";

type Common = {
  className?: string;
  children?: React.ReactNode;
};

type DivProps = Common &
  React.ComponentPropsWithoutRef<"div"> & {
    href?: null | undefined | "";
  };

type LinkProps = Common & {
  href: string;
} & Omit<React.ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;

export default function VerticalListItem(props: DivProps | LinkProps) {
  const baseStyle: string =
    "flex justify-between items-center bg-white dark:bg-stone-800 p-4 rounded-xl shadow border border-stone-100 dark:border-stone-700 w-full";

  const isEmptyHref: boolean = !("href" in props) || props.href == null || props.href === "";

  if (isEmptyHref) {
    const { className, children, ...divProps } = props as DivProps;
    return (
      <div className={`${baseStyle} ${className ?? ""}`} {...divProps}>
        {children}
      </div>
    );
  }

  const { className, children, href, ...linkProps } = props as LinkProps;
  return (
    <Link
      href={href}
      className={`${baseStyle} hover:bg-gray-100 dark:hover:bg-gray-700 ${className ?? ""}`}
      {...linkProps}
    >
      {children}
    </Link>
  );
}
