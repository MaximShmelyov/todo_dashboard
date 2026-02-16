import { useState, useRef, useEffect } from "react";

type Props = {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  textareaAriaLabel: string;
  className?: string;
};

export default function InlineEditTextarea({
  initialValue,
  onSave,
  onCancel,
  textareaAriaLabel,
  className,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <textarea
        ref={textareaRef}
        className="border rounded px-2 py-1 text-sm w-full resize-y"
        value={value}
        rows={3}
        aria-label={textareaAriaLabel}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSave(value);
          }
          if (e.key === "Escape") onCancel();
        }}
      />
      <button
        type="button"
        className="text-green-600 px-1"
        title="Save"
        onClick={() => onSave(value)}
        aria-label="Save"
      >
        ✔
      </button>
      <button
        type="button"
        className="text-red-600 px-1"
        title="Cancel"
        onClick={onCancel}
        aria-label="Cancel"
      >
        ✖
      </button>
    </div>
  );
}
