import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  return <input className="rounded-lg px-2 hover:bg-stone-100" {...props} />;
}