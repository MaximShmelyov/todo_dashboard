'use client'

import AddButton from "@/src/components/ui/buttons/AddButton"
import {Collection, CollectionType} from "@prisma/client";
import VerticalList from "@/src/components/ui/list/VerticalList";
import VerticalListItem from "@/src/components/ui/list/VerticalListItem";
import {getCollectionRoute} from "@/src/lib/utils";
import BackNavigation from "@/src/components/ui/buttons/BackNavigation";

export default function CollectionsClient({label, collectionType, items}: {
  label: string,
  collectionType: CollectionType,
  items: Collection[]
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="font-semibold">
          <BackNavigation href="/"/>
          <h2 className="inline text-2xl">{label}</h2>
        </div>
        <AddButton
          href="?create=1"
          aria-label="Create"
        >
          New
        </AddButton>
      </div>

      <VerticalList>
        {items.map(item => (
          <VerticalListItem
            key={item.id}
            href={`${getCollectionRoute(collectionType)}/${item.id}`}
          >
            <div>
              {/*<input*/}
              {/*  onClick={(e) => e.stopPropagation()}*/}
              {/*  className="mr-4 w-6 h-6"*/}
              {/*  type="checkbox"*/}
              {/*/>*/}
              <span>{item.title}</span>
            </div>
            <span className="text-sm text-stone-500">
              {item.family?.name ?? "(private)"}
            </span>
          </VerticalListItem>
        ))}
      </VerticalList>
    </div>
  )
}
