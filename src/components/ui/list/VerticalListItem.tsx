'use client'

import React from "react";
import Link from "next/link";

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function VerticalListItem(props: AnchorProps) {
  return (
    <Link
      className="flex justify-between items-center bg-white p-4 rounded-xl shadow border border-stone-100 hover:bg-gray-100 w-full"
      {...props}
    />
  );
}
