'use client'

import AddButton from "@/src/components/ui/buttons/AddButton";
import {Collection} from "@prisma/client";
import {getCollectionRoute} from "@/src/lib/utils";
import BackNavigation from "@/src/components/ui/buttons/BackNavigation";

export default function CollectionClient({collection}: {
  collection: Collection
}) {
  return (
    <div className="">
      <BackNavigation href={getCollectionRoute(collection.type)}/>
      <div className="text-lg font-semibold">{collection.title}</div>
      <div>{collection.description}</div>
      <div>{collection.family?.title ?? '(private)'}</div>
      <div className="mt-2 py-2 shadow-sm">
        <ul className="flex flex-col gap-2 p-2">
          {collection.items.map(item => (
            <li
              className="hover:bg-gray-100 p-2"
              key={item.id}
            >
              <div className="font-semibold">• {item.title}</div>
              <div className="ml-4">{item.body}</div>
              <div className="ml-4">{item.dueDate && <div>Due date:{item.dueDate}</div>}</div>
              <div className="ml-4">{item.updatedAt && ("Modified at: " + item.updatedAt?.toISOString())}</div>
              <div className="text-right w-full">{"by " + item.createdBy.name}</div>
            </li>
          ))}
        </ul>
        <div className="flex flex-row mx-auto justify-center">
          <AddButton
            href="?create=1"
            aria-label="Add item"
          >
            +
          </AddButton>
        </div>
      </div>
    </div>
  );
}