import { useState, useRef, useEffect } from "react";

type Props = {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  className?: string;
};

export default function InlineEditInput({ initialValue, onSave, onCancel, className }: Props) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <input
        ref={inputRef}
        className="border rounded px-2 py-1 text-sm w-full"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave(value);
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
