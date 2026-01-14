"use client";

import { signOut } from "next-auth/react";
import Button from "@/src/components/ui/Button";

export default function LogoutButton() {
  return <Button onClick={() => signOut({ callbackUrl: "/auth/login" })}>Logout</Button>;
}
