import "../globals.css";
import { getSession } from "@/src/lib/auth";
import PleaseLogIn from "@/src/components/common/PleaseLogIn";
import React from "react";

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return <>{!session || !session.user ? <PleaseLogIn /> : children}</>;
}
