import React, { ReactNode } from "react";

export default function VerticalList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>;
}
