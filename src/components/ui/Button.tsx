import React from "react";

import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "delete" | "itemTodo" | "itemDone";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className, loading = false, disabled, children, ...props },
  ref,
) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className ?? ""}`}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
});

export default Button;
