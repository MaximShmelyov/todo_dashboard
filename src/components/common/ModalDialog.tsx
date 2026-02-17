"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

export default function ModalDialog({
  children,
  open = true,
  onCloseAction,
  initialFocus,
}: {
  children: React.ReactNode;
  open?: boolean;
  onCloseAction: () => void;
  initialFocus?: React.RefObject<HTMLElement>;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onCloseAction}
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center"
          initialFocus={initialFocus}
        >
          <DialogBackdrop className="fixed inset-0 bg-black/40" data-testid="overlay" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="sm:mt-0 sm:mx-0 sm:w-full sm:max-w-sm sm:rounded-xl mt-8 mx-2 w-full max-w-md rounded-b-xl rounded-t-none bg-white dark:bg-gray-800 shadow-lg p-6 z-10"
          >
            <DialogPanel className="bg-transparent shadow-none p-0">{children}</DialogPanel>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
