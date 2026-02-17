"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

import Button from "@/src/components/ui/Button";

import styles from "./Register.module.css";

export default function Register() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") return null;

  return (
    <div className={styles.container}>
      <Button onClick={() => signIn("google")}>Continue with Google</Button>
      <div className={styles.linkRow}>
        <span>Already have an account?</span>
        <Link href="/auth/login" className={styles.link}>
          Log in
        </Link>
      </div>
    </div>
  );
}
