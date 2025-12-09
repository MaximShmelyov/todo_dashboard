import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function AddButton(props: ButtonProps) {
  return (<button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700" {...props}/>);
}