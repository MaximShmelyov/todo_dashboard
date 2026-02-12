import VerticalList from "@/src/components/ui/list/VerticalList";
import VerticalListItem from "@/src/components/ui/list/VerticalListItem";

export default function FamilyLoading() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <div className="w-8 h-8 bg-gray-200 dark:bg-stone-700 rounded-lg animate-pulse" />
        <div className="h-7 w-32 bg-gray-200 dark:bg-stone-700 rounded ml-2 animate-pulse" />
        <div className="w-24 h-8 bg-gray-200 dark:bg-stone-700 rounded-lg animate-pulse ml-auto" />
      </div>
      <div className="mt-2 h-5 w-24 bg-gray-200 dark:bg-stone-700 rounded animate-pulse" />
      <VerticalList>
        {Array.from({ length: 3 }).map((_, i) => (
          <VerticalListItem key={i}>
            <div className="h-6 w-40 bg-gray-200 dark:bg-stone-700 rounded animate-pulse" />
          </VerticalListItem>
        ))}
      </VerticalList>
      <div className="mt-2 h-5 w-24 bg-gray-200 dark:bg-stone-700 rounded animate-pulse" />
      <VerticalList>
        {Array.from({ length: 2 }).map((_, i) => (
          <VerticalListItem key={i}>
            <div className="h-6 w-36 bg-gray-200 dark:bg-stone-700 rounded animate-pulse" />
          </VerticalListItem>
        ))}
      </VerticalList>
      <div className="mt-4 w-32 h-10 bg-gray-200 dark:bg-stone-700 rounded-lg animate-pulse" />
    </div>
  );
}
