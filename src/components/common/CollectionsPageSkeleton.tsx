import VerticalList from "@/src/components/ui/list/VerticalList";
import VerticalListItem from "@/src/components/ui/list/VerticalListItem";

export default function CollectionsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="font-semibold flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-stone-700 rounded-lg animate-pulse" />
          <div className="h-7 w-32 bg-gray-200 dark:bg-stone-700 rounded animate-pulse" />
        </div>
        <div className="w-20 h-10 bg-gray-200 dark:bg-stone-700 rounded-lg animate-pulse" />
      </div>
      <VerticalList>
        {Array.from({ length: 4 }).map((_, i) => (
          <VerticalListItem key={i}>
            <div className="flex items-center gap-4">
              <div className="h-6 w-40 bg-gray-200 dark:bg-stone-700 rounded animate-pulse" />
            </div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-stone-700 rounded animate-pulse" />
          </VerticalListItem>
        ))}
      </VerticalList>
    </div>
  );
}
