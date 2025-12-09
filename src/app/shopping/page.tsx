import type {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Shopping',
};

export default function Shopping() {
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">🛍 Shopping list</h2>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          + Add
        </button>
      </div>

      <div className="space-y-3">

        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow border border-stone-100">
          <span className="text-stone-800">Milk</span>
          <span className="text-sm text-stone-500">(family)</span>
        </div>

        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow border border-stone-100">
          <span className="text-stone-800">Bread</span>
          <span className="text-sm text-stone-500">(my list)</span>
        </div>

      </div>
    </div>
  );
}
