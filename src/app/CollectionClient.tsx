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
      <div className="w-full max-w-full overflow-x-hidden px-2">
        <BackNavigation href={getCollectionRoute(collection.type)} />
        <div className="flex flex-wrap items-start justify-between gap-2 w-full min-w-0 mb-2">
          <div className="text-lg font-semibold min-w-0 break-words">{collection.title}</div>

          {idsToDeleteState.length !== 0 && (
            <Button onClick={onMultiDelete} variant={"delete"} className="shrink-0 max-w-full">
              {`Delete selected (${idsToDeleteState.length})`}
            </Button>
          )}
        </div>
        <div className="truncate break-words">{collection.description}</div>
        <div className="truncate break-words">{collection.family?.name ?? "(private)"}</div>
        <div className="mt-2 py-2 shadow-sm rounded-sm w-full max-w-full">
          <ul className="flex flex-col gap-2 p-2 w-full max-w-full">
            {collection.items.length > 0
              ? collection.items.map((item) => (
                  <li
                    className={`
              bg-white dark:bg-stone-900
              border border-gray-200 dark:border-stone-700
              border-l-4 ${item.done ? "dark:border-l-stone-800" : "border-l-blue-500"}
              p-4 rounded-lg shadow
              mb-2
              transition
              overflow-hidden
              w-full
              max-w-full
            `}
                    key={item.id}
                  >
                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 w-full max-w-full">
                      <input
                        className="w-5 h-5 mt-1 shrink-0"
                        type="checkbox"
                        checked={idsToDeleteState.includes(item.id)}
                        onChange={(e) => {
                          idsToDeleteDispatch({
                            id: item.id,
                            type: e.target.checked ? "ADD" : "REMOVE",
                          });
                        }}
                      />
                      <span
                        className={`
    flex-1 min-w-0 break-words break-all
    ${item.done ? "line-through text-gray-400" : "font-semibold"}
  `}
                        title={item.title}
                      >
                        {item.title}
                      </span>
                      <div className="flex flex-row flex-wrap gap-2 w-full sm:w-auto sm:ml-auto justify-end">
                        <Button
                          variant={item.done ? "itemDone" : "itemTodo"}
                          className="h-8 leading-4 min-w-0 max-w-[110px] px-2 truncate"
                          onClick={async () => {
                            await toggleItemDone(item);
                            router.refresh();
                          }}
                          aria-label="Change status"
                          title={item.done ? "Done ✔" : "Todo"}
                        >
                          {item.done ? "Done ✔" : "Todo"}
                        </Button>
                        <Button
                          className="!p-1 !rounded-xl !text-xs min-w-0 max-w-[80px] px-2 truncate"
                          onClick={() => onSingleDelete(item.id)}
                          title="Delete"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    {item.body && (
                      <div
                        className={`ml-0 sm:ml-4 mt-1 italic text-sm break-words break-all ${item.done ? "line-through text-gray-400" : ""}`}
                      >
                        {item.body}
                      </div>
                    )}
                    <div className="flex items-center mt-2 ml-0 sm:ml-4 text-xs text-gray-500 break-words break-all">
                      by {item.createdBy.name}
                    </div>
                  </li>
                ))
              : "No items yet"}
          </ul>
          <div className="flex flex-row mx-auto justify-center">
            <AddButton href="?create=1" aria-label="Add item">
              Add item
            </AddButton>
          </div>
          <div className="flex mt-8 px-2">
            <Button onClick={onCollectionDelete} variant={"delete"} className="ml-auto">
              {`Delete ${getLabelOfCollectionType(collection.type)}`}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
