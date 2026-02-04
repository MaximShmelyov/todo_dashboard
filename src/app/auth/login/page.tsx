"use client";

import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "@/src/components/ui/Button";

export default function Login() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") return null;

  return (
    <>
      <Head>
        <title>Login - {process.env.SITE_TITLE}</title>
        <meta name="description" content={`Login page for ${process.env.SITE_TITLE}`} />
      </Head>
      <Button onClick={() => signIn("google")}>Login via Google</Button>
    </>
  );
}
