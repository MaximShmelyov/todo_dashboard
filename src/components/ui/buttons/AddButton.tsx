import React from "react";
import Link from "next/link";

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function AddButton(props: AnchorProps) {
  return (
    <Link
      className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
      {...props}
    />
  );
}