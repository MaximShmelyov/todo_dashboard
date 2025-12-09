"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "@/src/components/ui/Button";

export default function Login() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/"); // укажите нужный путь
    }
  }, [status, router]);

  if (status === "loading") return null;

  return (
    <Button onClick={() => signIn("google")}>
      Login via Google
    </Button>
  );
}