"use client";

import { AnimatePresence, motion } from "framer-motion";
import Button from "@/src/components/ui/Button";

export default function ConfirmPopup({
  title,
  onCancelAction,
  onConfirmAction,
}: {
  title: string;
  onCancelAction: () => void;
  onConfirmAction: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => onCancelAction()}
      >
        <motion.div
          className="flex flex-col gap-8
                     bg-white dark:bg-stone-800
                     p-6 rounded-sm shadow-xl w-60"
          initial={{ scale: 0.9, opacity: 0, y: 32 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -32 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-bold text-center">{title}</div>
          <div className="flex flex-row justify-around">
            <Button variant={"delete"} onClick={() => onConfirmAction()}>
              Yes
            </Button>
            <Button onClick={() => onCancelAction()}>No</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
