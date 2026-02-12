import Card from "@/src/components/ui/Card";
import VerticalList from "@/src/components/ui/list/VerticalList";
import VerticalListItem from "@/src/components/ui/list/VerticalListItem";

export default function FamilyListLoading() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card
          key={i}
          title={<div className="h-6 w-32 bg-gray-200 dark:bg-stone-700 rounded animate-pulse" />}
          cardActions={[
            {
              title: (
                <div className="h-5 w-20 bg-gray-200 dark:bg-stone-700 rounded animate-pulse" />
              ),
              href: "#",
            },
          ]}
        >
          <div className="h-4 w-20 bg-gray-200 dark:bg-stone-700 rounded mb-2 animate-pulse" />
          <VerticalList>
            {Array.from({ length: 2 }).map((_, j) => (
              <VerticalListItem key={j}>
                <div className="h-5 w-36 bg-gray-200 dark:bg-stone-700 rounded animate-pulse" />
              </VerticalListItem>
            ))}
          </VerticalList>
        </Card>
      ))}
      <div className="w-40 h-10 bg-gray-200 dark:bg-stone-700 rounded-lg animate-pulse" />
    </div>
  );
}
