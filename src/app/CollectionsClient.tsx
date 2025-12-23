'use client'

import {useRouter} from "next/navigation"
import AddButton from "@/src/components/ui/buttons/AddButton"
import {Collection, CollectionType} from "@prisma/client";
import VerticalList from "@/src/components/ui/list/VerticalList";
import VerticalListItem from "@/src/components/ui/list/VerticalListItem";
import {getCollectionRoute} from "@/src/lib/utils";

export default function CollectionsClient({label, collectionType, items}: {
  label: string,
  collectionType: CollectionType,
  items: Collection[]
}) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">🛍 {label}</h2>
        <AddButton onClick={() => router.push("?create=1")}>
          + Add
        </AddButton>
      </div>

      <VerticalList>
        {items.map(item => (
          <VerticalListItem
            key={item.id}
            onClick={() => router.push(`${getCollectionRoute(collectionType)}/${item.id}`)}
          >
            <div>
              <input className="mr-4 w-6 h-6" type="checkbox"/>
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
