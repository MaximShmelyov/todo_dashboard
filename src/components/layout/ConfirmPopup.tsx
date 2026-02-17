"use client";

import React, { useRef } from "react";

import ModalDialog from "@/src/components/common/ModalDialog";
import Button from "@/src/components/ui/Button";

export default function ConfirmPopup({
  title,
  onCancelAction,
  onConfirmAction,
  open = true,
}: {
  title: string;
  onCancelAction: () => void;
  onConfirmAction: () => void;
  open?: boolean;
}) {
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  return (
    <ModalDialog
      open={open}
      onCloseAction={onCancelAction}
      initialFocus={initialFocusRef as React.RefObject<HTMLElement>}
    >
      <div className="flex flex-col gap-6 min-w-[240px]">
        <div className="font-semibold text-lg text-center">{title}</div>
        <div className="flex flex-row gap-4 justify-center">
          <Button
            variant="delete"
            onClick={onConfirmAction}
            className="min-w-[80px]"
            aria-label="Confirm"
          >
            Yes
          </Button>
          <Button
            onClick={onCancelAction}
            className="min-w-[80px]"
            aria-label="Cancel"
            ref={initialFocusRef}
          >
            No
          </Button>
        </div>
      </div>
    </ModalDialog>
  );
}
