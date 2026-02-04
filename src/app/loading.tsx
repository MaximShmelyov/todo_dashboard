import Card from "@/src/components/ui/Card";
import VerticalList from "@/src/components/ui/list/VerticalList";
import VerticalListItem from "@/src/components/ui/list/VerticalListItem";

export default function HomeLoading() {
  return (
    <div className="space-y-8 w-full max-w-full">
      <div className="h-8 w-32 bg-gray-200 dark:bg-stone-700 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            title={<div className="h-6 w-28 bg-gray-200 dark:bg-stone-700 rounded animate-pulse" />}
          >
            <VerticalList>
              {Array.from({ length: 2 }).map((_, j) => (
                <VerticalListItem key={j}>
                  <div className="h-5 w-40 bg-gray-200 dark:bg-stone-700 rounded animate-pulse" />
                </VerticalListItem>
              ))}
            </VerticalList>
            <div className="block mt-2 h-4 w-32 bg-gray-200 dark:bg-stone-700 rounded animate-pulse" />
          </Card>
        ))}
      </div>
    </div>
  );
}
