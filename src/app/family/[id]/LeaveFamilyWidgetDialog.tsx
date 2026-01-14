"use client";

import Button from "@/src/components/ui/Button";

export default function LeaveFamilyWidgetDialog({
  onConfirmAction,
  onCancelAction,
  familyName,
}: {
  onConfirmAction: () => void;
  onCancelAction: () => void;
  familyName: string;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center"
      onClick={onCancelAction}
    >
      <div
        className="bg-white rounded-xl p-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="fong-lg">
          Do you want to leave <span className="font-semibold">{familyName}</span>?
        </h3>
        <div className="flex flex-row justify-around">
          <Button variant={"secondary"} onClick={onConfirmAction}>
            Confirm
          </Button>
          <Button onClick={onCancelAction}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
