'use client'

export default function LeaveFamilyWidgetDialog({onConfirm, onCancel, familyName}: {
  onConfirm: () => void,
  onCancel: () => void,
  familyName: string
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl p-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="fong-lg">Do you want to leave <span className="font-semibold">{familyName}</span>?</h3>
        <div className="flex flex-row justify-around">
          <button
            className="bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded-xl cursor-pointer"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-stone-100 hover-bg-stone-200 px-2 py-1 rounded-xl cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}