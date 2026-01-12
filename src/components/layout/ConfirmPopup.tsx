'use client'

import Button from "@/src/components/ui/Button";

export default function ConfirmPopup({title, onCancelAction, onConfirmAction}: { title: string, onCancelAction: () => void, onConfirmAction: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center"
      onClick={() => onCancelAction()}
    >
      <div
        className="flex flex-col gap-8 bg-white p-6 rounded-sm shadow-xl w-60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-bold text-center">{title}</div>
        <div className="flex flex-row justify-around">
          <Button
            variant={'delete'}
            onClick={() => onConfirmAction()}
          >
            Yes
          </Button>
          <Button
            onClick={() => onCancelAction()}
          >
            No
          </Button>
        </div>
      </div>
    </div>
  );
}