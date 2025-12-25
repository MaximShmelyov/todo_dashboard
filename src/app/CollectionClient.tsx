'use client'

import AddButton from "@/src/components/ui/buttons/AddButton";
import {Collection} from "@prisma/client";
import {getCollectionRoute} from "@/src/lib/utils";
import BackNavigation from "@/src/components/ui/buttons/BackNavigation";
import {useState} from "react";
import ConfirmPopup from "@/src/components/layout/ConfirmPopup";
import {deleteItem} from "@/src/db/actions/item";
import {useRouter} from "next/navigation";

export default function CollectionClient({collection}: {
  collection: Collection
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string>("");
  const router = useRouter();

  const onDelete = (id: string) => {
    setDeletingId(id);
    setShowDeleteDialog(true);
  };
  const onDeleteConfirm = async (id: string) => {
    console.warn(`Deleting ${id} item`);
    await deleteItem(id);
    router.refresh();
    setDeletingId("");
    setShowDeleteDialog(false);
  };
  const onDeleteCancel = () => {
    setDeletingId("");
    setShowDeleteDialog(false);
  }

  return (
    <>
      {showDeleteDialog && <ConfirmPopup title="Are you sure?" onConfirm={() => onDeleteConfirm(deletingId)} onCancel={onDeleteCancel}/>}
      <div className="">
        <BackNavigation href={getCollectionRoute(collection.type)}/>
        <div className="text-lg font-semibold">{collection.title}</div>
        <div>{collection.description}</div>
        <div>{collection.family?.title ?? '(private)'}</div>
        <div className="mt-2 py-2 shadow-sm rounded-sm">
          <ul className="flex flex-col gap-2 p-2">
            {collection.items.map(item => (
              <li
                className="hover:bg-gray-100 p-2 rounded-sm"
                key={item.id}
              >
                <div className="flex flex-row justify-between">
                  <div className="font-semibold">• {item.title}</div>
                  <button
                    className="rounded-xl bg-red-400 w-10 text-white hover:bg-red-600"
                    onClick={() => onDelete(item.id)}
                    aria-label="Delete"
                  >
                    X
                  </button>
                </div>
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
    </>
  );
}