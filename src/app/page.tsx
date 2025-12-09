export default async function Home() {
  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-semibold tracking-tight">
        Today
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Shopping */}
        <div className="bg-white rounded-2xl shadow p-6 border border-stone-100">
          <h3 className="text-lg font-semibold mb-3">🛍 Shopping</h3>
          <ul className="text-sm text-stone-700 space-y-1">
            <li>• Milk</li>
            <li>• Bread</li>
            <li>• Eggs</li>
          </ul>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow p-6 border border-stone-100">
          <h3 className="text-lg font-semibold mb-3">📝 Notes</h3>
          <p className="text-sm text-stone-700">
            Idea: amazing idea.
          </p>
        </div>

        {/* Todo */}
        <div className="bg-white rounded-2xl shadow p-6 border border-stone-100">
          <h3 className="text-lg font-semibold mb-3">✔️ Todo</h3>
          <ul className="text-sm text-stone-700 space-y-1">
            <li>• Pay bills</li>
            <li>• Take out the trash</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
