"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useEffect, useState } from "react";

export default function ModalDialog({
  children,
  open = true,
  onCloseAction,
}: {
  children: React.ReactNode;
  open?: boolean;
  onCloseAction: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog
      open={open}
      onClose={onCloseAction}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/40" data-testid="overlay" />
      <DialogPanel className="rounded-xl bg-white dark:bg-gray-800 shadow-lg p-6 z-10">
        {children}
      </DialogPanel>
    </Dialog>
  );
}
