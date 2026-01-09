import React from "react";
import Link from "next/link";

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function BackNavigation(props: AnchorProps) {
  return (
    <Link
      className="inline-block text-center text-3xl hover:bg-gray-100 rounded-lg w-20 h-10"
      replace
      {...props}
    >
      ←
    </Link>
  );
}