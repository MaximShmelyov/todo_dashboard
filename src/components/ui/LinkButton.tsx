import Link from "next/link";
import React from "react";
import style from "./LinkButton.module.css";

type LinkButtonVariant = "primary" | "secondary" | "add";

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string } & {
  variant?: LinkButtonVariant;
};

export default function LinkButton({ variant = "primary", className, ...props }: LinkButtonProps) {
  return <Link className={`${style.linkButton} ${style[variant]} ${className}`} {...props} />;
}
