import React from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant,
};

export default function Button({variant = "primary", className, ...props}: ButtonProps) {
  return <button className={`${styles.button} ${styles[variant]} ${className}`} {...props} />;
}