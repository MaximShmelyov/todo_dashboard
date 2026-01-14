"use client";

import AddButton from "@/src/components/ui/buttons/AddButton";
import { Item } from "@prisma/client";
import { getCollectionRoute, getLabelOfCollectionType } from "@/src/lib/utils";
import BackNavigation from "@/src/components/ui/buttons/BackNavigation";
import { useReducer, useState } from "react";
import ConfirmPopup from "@/src/components/layout/ConfirmPopup";
import { deleteItem, deleteItems, updateItem } from "@/src/db/actions/item";
import { useRouter } from "next/navigation";
import { CollectionExtended, deleteCollection } from "@/src/db/actions/collections";
import Button from "@/src/components/ui/Button";

type AddAction = { id: string; type: "ADD" };
type RemoveAction = { id: string; type: "REMOVE" };
type ClearAction = { type: "CLEAR" };

const initialIdsToDelete: string[] = [];

function idsToDeleteReducer(
  state: string[],
  action: AddAction | RemoveAction | ClearAction,
): string[] {
  switch (action.type) {
    case "ADD":
      return [...state, action.id];
    case "REMOVE":
      return state.filter((id) => id !== action.id);
    case "CLEAR":
      return [];
  }
}

const toggleItemDone = async (item: Pick<Item, "id" | "done">): Promise<void> => {
  await updateItem({ id: item.id, done: !item.done });
};

export default function CollectionClient({
  collection,
}: {
  collection: NonNullable<CollectionExtended>;
}) {
  const [showCollectionDeleteDialog, setShowCollectionDeleteDialog] = useState(false);
  const [showSingleDeleteDialog, setShowSingleDeleteDialog] = useState(false);
  const [showMultiDeleteDialog, setShowMultiDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string>("");
  const [idsToDeleteState, idsToDeleteDispatch] = useReducer(
    idsToDeleteReducer,
    initialIdsToDelete,
  );
  const router = useRouter();

  // Collection delete
  const onCollectionDelete = () => {
    setShowCollectionDeleteDialog(true);
  };
  const onCollectionDeleteConfirm = async () => {
    await deleteCollection(collection.id);
    router.replace(getCollectionRoute(collection.type));
    setShowCollectionDeleteDialog(false);
  };
  const onCollectionDeleteCancel = () => {
    setShowCollectionDeleteDialog(false);
  };

  // Single delete
  const onSingleDelete = (id: string) => {
    setDeletingId(id);
    setShowSingleDeleteDialog(true);
  };
  const onSingleDeleteConfirm = async (id: string) => {
    console.warn(`Deleting ${id} item`);
    await deleteItem(id);
    router.refresh();
    setDeletingId("");
    setShowSingleDeleteDialog(false);
  };
  const onSingleDeleteCancel = () => {
    setDeletingId("");
    setShowSingleDeleteDialog(false);
  };

  // Multi delete
  const onMultiDelete = () => {
    setShowMultiDeleteDialog(true);
  };
  const onMultiDeleteConfirm = async () => {
    console.warn(`Deleting: ${idsToDeleteState}`);
    await deleteItems(idsToDeleteState);
    router.refresh();
    setShowMultiDeleteDialog(false);
    idsToDeleteDispatch({ type: "CLEAR" });
  };
  const onMultiDeleteCancel = async () => {
    setShowMultiDeleteDialog(false);
  };

  return (
    <>
      {showCollectionDeleteDialog && (
        <ConfirmPopup
          title={`Delete ${getLabelOfCollectionType(collection.type)}`}
          onCancelAction={onCollectionDeleteCancel}
          onConfirmAction={onCollectionDeleteConfirm}
        />
      )}
      {showSingleDeleteDialog && (
        <ConfirmPopup
          title="Are you sure?"
          onConfirmAction={() => onSingleDeleteConfirm(deletingId)}
          onCancelAction={onSingleDeleteCancel}
        />
      )}
      {showMultiDeleteDialog && (
        <ConfirmPopup
          title="Are you sure?"
          onConfirmAction={onMultiDeleteConfirm}
          onCancelAction={onMultiDeleteCancel}
        />
      )}
      <div className="">
        <BackNavigation href={getCollectionRoute(collection.type)} />
        <div className="flex flex-row justify-between">
          <div className="text-lg font-semibold">{collection.title}</div>
          {idsToDeleteState.length !== 0 && (
            <Button onClick={onMultiDelete} variant={"delete"}>
              Delete selected
            </Button>
          )}
        </div>
        <div>{collection.description}</div>
        <div>{collection.family?.name ?? "(private)"}</div>
        <div className="mt-2 py-2 shadow-sm rounded-sm">
          <ul className="flex flex-col gap-2 p-2">
            {collection.items.length > 0
              ? collection.items.map((item) => (
                  <li className="hover:bg-gray-100 p-2 rounded-sm shadow-xs" key={item.id}>
                    <div className="flex flex-row justify-between gap-2 h-20 items-start overflow-clip">
                      <input
                        className="w-5 h-5"
                        type="checkbox"
                        onChange={(e) => {
                          idsToDeleteDispatch({
                            id: item.id,
                            type: e.target.checked ? "ADD" : "REMOVE",
                          });
                        }}
                      />
                      <div className={`flex-3 ${item.done ? "" : "font-semibold"}`}>
                        {item.title}
                      </div>
                      <Button
                        variant={item.done ? "itemDone" : "itemTodo"}
                        className="flex-1 h-8 leading-4"
                        onClick={async () => {
                          await toggleItemDone(item);
                          router.refresh();
                        }}
                      >
                        {item.done ? "Done" : "Todo"}
                      </Button>
                    </div>
                    <div className="ml-4">{item.body}</div>
                    {/*<div className="ml-4">{item.dueDate && <div>Due date:{item.dueDate.toLocaleString()}</div>}</div>*/}
                    {/*<div className="ml-4">{item.updatedAt && ("Modified at: " + item.updatedAt.toLocaleString())}</div>*/}
                    <div className="flex flex-row mt-4 justify-between items-end">
                      <Button
                        variant={"delete"}
                        className={"!p-1 !rounded-xl"}
                        onClick={() => onSingleDelete(item.id)}
                        aria-label="Delete"
                      >
                        Delete
                      </Button>
                      <div className="ml-auto">{"by " + item.createdBy.name}</div>
                    </div>
                  </li>
                ))
              : "No items yet"}
          </ul>
          <div className="flex flex-row mx-auto justify-center">
            <AddButton href="?create=1" aria-label="Add item">
              +
            </AddButton>
          </div>
          <div className="flex mt-8 px-2">
            <Button onClick={onCollectionDelete} variant={"delete"} className={"ml-auto"}>
              {`Delete ${getLabelOfCollectionType(collection.type)}`}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
