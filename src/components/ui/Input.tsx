import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  return (
    <input
      className="rounded-lg px-2 hover:bg-stone-100 dark:hover:bg-gray-600 h-10 text-lg"
      ref={ref}
      {...props}
    />
  );
});

export default Input;
