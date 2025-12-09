import React, {ReactNode} from "react";

export default function VerticalList({children} : { children: ReactNode[]}) {
  return (<div className="space-y-3">{children}</div>);
}