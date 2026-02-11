"use client";

import AddButton from "@/src/components/ui/buttons/AddButton";
import { CollectionType } from "@prisma/client";
import VerticalList from "@/src/components/ui/list/VerticalList";
import VerticalListItem from "@/src/components/ui/list/VerticalListItem";
import { getCollectionRoute } from "@/src/lib/utils";
import BackNavigation from "@/src/components/ui/buttons/BackNavigation";
import { CollectionsExtended } from "@/src/db/actions/collections";

export default function CollectionsClient({
  label,
  collectionType,
  items,
}: {
  label: string;
  collectionType: CollectionType;
  items: CollectionsExtended;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="font-semibold">
          <BackNavigation href="/" />
          <h2 className="inline text-2xl">{label}</h2>
        </div>
        <AddButton href="?create=1" aria-label="Create">
          New
        </AddButton>
      </div>

      {!items.length && <p>This list is empty. Add your first item!</p>}
      {items.length > 0 && (
        <VerticalList>
          {items.map((item) => (
            <VerticalListItem
              key={item.id}
              href={`${getCollectionRoute(collectionType)}/${item.id}`}
            >
              <div>
                <span>{item.title}</span>
              </div>
              <span className="text-sm">{item.family?.name ?? "(private)"}</span>
            </VerticalListItem>
          ))}
        </VerticalList>
      )}
    </div>
  );
}
