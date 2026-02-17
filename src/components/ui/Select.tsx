import React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select(props: SelectProps) {
  return (
    <select
      className="
        rounded-lg px-2 h-10 text-lg
        bg-white dark:bg-gray-700
        hover:bg-stone-100 dark:hover:bg-gray-600
        transition-colors
      "
      {...props}
    />
  );
}
