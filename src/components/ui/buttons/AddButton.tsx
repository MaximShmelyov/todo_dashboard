import React from "react";

import LinkButton from "@/src/components/ui/LinkButton";

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function AddButton(props: AnchorProps) {
  return <LinkButton variant={"add"} className="!px-4 !py-2" {...props} />;
}
