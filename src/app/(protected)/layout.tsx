import "../globals.css";
import React from "react";

import PleaseLogIn from "@/src/components/common/PleaseLogIn";
import { getSession } from "@/src/lib/auth";

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return <>{!session || !session.user ? <PleaseLogIn /> : children}</>;
}
