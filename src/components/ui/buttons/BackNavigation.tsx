import Link from "next/link";
import React from "react";

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function BackNavigation(props: AnchorProps) {
  return (
    <Link
      className="inline-block text-center text-3xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-20 h-10"
      replace
      {...props}
    >
      ←
    </Link>
  );
}
