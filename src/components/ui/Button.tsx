import React from "react";

import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "delete" | "itemTodo" | "itemDone";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={`${styles.button} ${styles[variant]} ${className}`} {...props} />;
}
