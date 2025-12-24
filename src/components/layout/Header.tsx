import React from "react";
import ProfileMenu from "@/src/components/layout/ProfileMenu";

export default function Header() {
  return (
    <header className="flex-1 bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      <h1 className="hidden md:block text-xl font-semibold">Control panel</h1>
      <ProfileMenu/>
    </header>);
}