import React from "react";

import Button from "../Button";

export default function ExportButton({
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button onClick={onClick} {...props}>
      <span className="hidden sm:inline">Export</span>
      <span className="inline sm:hidden">Exp</span>
    </Button>
  );
}
