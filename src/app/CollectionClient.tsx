"use client";

import { useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { Item } from "@prisma/client";
import { getCollectionRoute } from "@/src/lib/utils";
import { deleteItem, deleteItems, updateItem } from "@/src/db/actions/item";
import { CollectionExtended, deleteCollection } from "@/src/db/actions/collections";
import CollectionView from "./CollectionView";

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

  // Dialog handlers
  const dialogHandlers = {
    collection: {
      open: () => setShowCollectionDeleteDialog(true),
      confirm: async () => {
        await deleteCollection(collection.id);
        router.replace(getCollectionRoute(collection.type));
        setShowCollectionDeleteDialog(false);
      },
      cancel: () => setShowCollectionDeleteDialog(false),
    },
    single: {
      open: (id: string) => {
        setDeletingId(id);
        setShowSingleDeleteDialog(true);
      },
      confirm: async (id: string) => {
        await deleteItem(id);
        router.refresh();
        setDeletingId("");
        setShowSingleDeleteDialog(false);
      },
      cancel: () => {
        setDeletingId("");
        setShowSingleDeleteDialog(false);
      },
    },
    multi: {
      open: () => setShowMultiDeleteDialog(true),
      confirm: async () => {
        await deleteItems(idsToDeleteState);
        router.refresh();
        setShowMultiDeleteDialog(false);
        idsToDeleteDispatch({ type: "CLEAR" });
      },
      cancel: () => setShowMultiDeleteDialog(false),
    },
  };

  // Item handlers
  const itemHandlers = {
    toggleDone: async (item: Pick<Item, "id" | "done">) => {
      await updateItem({ id: item.id, done: !item.done });
      router.refresh();
    },
    toggleSelect: (id: string, checked: boolean) => {
      idsToDeleteDispatch({
        id,
        type: checked ? "ADD" : "REMOVE",
      });
    },
    delete: (id: string) => {
      dialogHandlers.single.open(id);
    },
  };

  return (
    <CollectionView
      collection={collection}
      idsToDelete={idsToDeleteState}
      showDialogs={{
        collection: showCollectionDeleteDialog,
        single: showSingleDeleteDialog,
        multi: showMultiDeleteDialog,
      }}
      deletingId={deletingId}
      dialogHandlers={dialogHandlers}
      itemHandlers={itemHandlers}
    />
  );
}
