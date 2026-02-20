import React from "react";

import Button, { type ButtonVariant } from "@/src/components/ui/Button";

export default function ModifySelectedButton({
  variant,
  count,
  onClick,
  ...props
}: {
  variant?: ButtonVariant;
  count: number;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  if (count === 0) return null;
  return <Button onClick={onClick} variant={variant} className="shrink-0 max-w-full" {...props} />;
}
