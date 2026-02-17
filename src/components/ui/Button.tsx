import React from "react";

import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "delete" | "itemTodo" | "itemDone";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className, ...props },
  ref,
) {
  return (
    <button className={`${styles.button} ${styles[variant]} ${className}`} {...props} ref={ref} />
  );
});

export default Button;
