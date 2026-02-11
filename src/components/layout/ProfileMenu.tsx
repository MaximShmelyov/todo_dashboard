"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import PopupMenu, { PopupMenuItem } from "@/src/components/layout/PopupMenu";
import Image from "next/image";
import { Session } from "next-auth";

interface PopupMenuItemWithAction extends PopupMenuItem {
  action: () => void;
}

function getActionItems(signedIn: boolean): PopupMenuItemWithAction[] {
  if (signedIn) {
    return [
      {
        id: "0",
        title: "Sign-out",
        action: () => signOut().then(() => console.log("logged out")),
      },
    ];
  }
  return [
    {
      id: "1",
      title: "Sign-in",
      action: () => signIn("google").then(() => console.log("logged in")),
    },
  ];
}

type SessionStatus = ReturnType<typeof useSession>["status"];

function getAuthenticationStatusMessage(session: Session | null, status: SessionStatus): string {
  switch (status) {
    case "authenticated":
      return session?.user?.name ?? "Unknown";
    case "unauthenticated":
      return "Logged out";
    case "loading":
      return "Loading...";
    default:
      throw new Error("Got unexpected status");
  }
}

export default function ProfileMenu() {
  const { data: session, status } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const onItemSelected = (item: PopupMenuItem) => {
    console.log(`${item} selected`);
    (item as PopupMenuItemWithAction).action();
    setOpen(false);
  };

  const items: PopupMenuItemWithAction[] = useMemo(
    () => getActionItems(status === "authenticated"),
    [status],
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3 ml-auto" ref={menuRef}>
      <span className="text-sm not-dark:text-stone-600">
        {getAuthenticationStatusMessage(session, status)}
      </span>
      <button
        className="w-8 h-8 rounded-full bg-stone-300 dark:bg-stone-500 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        {session && session.user && (
          <Image
            className="rounded-full"
            src={session.user.image ?? ""}
            alt="Profile image"
            width={100}
            height={100}
          />
        )}
      </button>
      <PopupMenu open={open} popupMenuItems={items} onItemSelected={onItemSelected} />
    </div>
  );
}
