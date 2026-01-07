'use client'

import React from "react";
import Link from "next/link";

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function VerticalListItem(props: AnchorProps) {
  const isEmptyHref = props.href.length <= 0;

  return (
    <Link
      className={`flex justify-between items-center bg-white p-4 rounded-xl shadow border border-stone-100 w-full
        ${isEmptyHref ? 'cursor-default' : 'hover:bg-gray-100'}`}
      {...props}
    />
  );
}
