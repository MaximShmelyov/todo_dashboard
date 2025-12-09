import Card from "@/src/components/ui/Card";

export default async function Home() {
  return (
    <div className="space-y-8">

      <h2 className="text-2xl font-semibold tracking-tight">
        Today
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Shopping */}
        <Card title={"🛍 Shopping"}>
          <ul className="text-sm text-stone-700 space-y-1">
            <li>• Milk</li>
            <li>• Bread</li>
            <li>• Eggs</li>
          </ul>
        </Card>

        {/* Notes */}
        <Card title={"📝 Notes"}>
          <p className="text-sm text-stone-700">
            Idea: amazing idea.
          </p>
        </Card>

        {/* Todo */}
        <Card title={"✔️ Todo"}>
          <ul className="text-sm text-stone-700 space-y-1">
            <li>• Pay bills</li>
            <li>• Take out the trash</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}
