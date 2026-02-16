import React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea(props: TextareaProps) {
  return (
    <textarea
      className="rounded-lg px-2 py-2 hover:bg-stone-100 dark:hover:bg-gray-600 text-lg resize-y min-h-[48px]"
      {...props}
    />
  );
}
