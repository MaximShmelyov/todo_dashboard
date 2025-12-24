'use client'

import AddButton from "@/src/components/ui/buttons/AddButton";
import {Collection} from "@prisma/client";
import {useRouter} from "next/navigation";

export default function CollectionClient({collection}: {
  collection: Collection
}) {
  const router = useRouter();

  return (
    <div className="">
      <div className="text-lg font-medium">{collection.title}</div>
      <div>{collection.description}</div>
      <div>{collection.family?.title ?? 'private'}</div>
      <div className="mt-2 py-2 shadow-sm">
        <div className="">Items:</div>
        <ul className="flex flex-col gap-2 p-2">
          {collection.items.map(item => (
            <li
              className="hover:bg-gray-100"
              key={item.id}
            >
              <div className="font-medium">{item.title}</div>
              <div>{item.body}</div>
              <div>{item.dueDate && <div>Due date:{item.dueDate}</div>}</div>
              <div>{item.updatedAt && ("Modified at: " + item.updatedAt?.toISOString())}</div>
              <div>{"by " + item.createdBy.name}</div>
            </li>
          ))}
        </ul>
        <div className="flex flex-row mx-auto justify-center">
          <AddButton
            onClick={() => router.push("?create=1")}
            aria-label="Add item"
          >
            +
          </AddButton>
        </div>
      </div>
    </div>
  );
}