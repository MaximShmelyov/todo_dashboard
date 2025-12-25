'use client'

export default function ConfirmPopup({title, onCancel, onConfirm}: { title: string, onCancel: () => void, onConfirm: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center"
      onClick={() => onCancel()}
    >
      <div
        className="flex flex-col gap-8 bg-white p-6 rounded-sm shadow-xl w-60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-bold text-center">{title}</div>
        <div className="flex flex-row justify-around">
          <button
            className="bg-red-400 hover:bg-red-600 text-white py-2 px-4 rounded-xl"
            onClick={() => onConfirm()}
          >
            Yes
          </button>
          <button
            className="bg-stone-400 hover:bg-stone-500 text-white py-2 px-4 rounded-xl"
            onClick={() => onCancel()}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}