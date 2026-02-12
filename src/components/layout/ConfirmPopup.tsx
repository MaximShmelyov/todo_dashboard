"use client";

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
  return (
    <ModalDialog open={open} onCloseAction={onCancelAction}>
      <div className="flex flex-col gap-8 w-60">
        <div className="font-bold text-center">{title}</div>
        <div className="flex flex-row justify-around">
          <Button variant={"delete"} onClick={onConfirmAction}>
            Yes
          </Button>
          <Button onClick={onCancelAction}>No</Button>
        </div>
      </div>
    </ModalDialog>
  );
}
