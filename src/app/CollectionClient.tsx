"use client";

import { useReducer, useState, useMemo } from "react";
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

type SortOption =
  | "created_desc"
  | "created_asc"
  | "title_asc"
  | "title_desc"
  | "done_asc"
  | "done_desc";

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
  const [sortOption, setSortOption] = useState<SortOption>("created_desc");
  const router = useRouter();

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
    editTitle: async (id: string, title: string) => {
      await updateItem({ id, title });
      router.refresh();
    },
    editBody: async (id: string, body: string) => {
      await updateItem({ id, body });
      router.refresh();
    },
    delete: (id: string) => {
      dialogHandlers.single.open(id);
    },
  };

  const sortedItems = useMemo(() => {
    const items = [...collection.items];
    items.sort((a, b) => {
      let cmp = 0;
      switch (sortOption) {
        case "created_asc":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "created_desc":
          cmp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case "title_asc":
          cmp = a.title.localeCompare(b.title);
          break;
        case "title_desc":
          cmp = b.title.localeCompare(a.title);
          break;
        case "done_asc":
          cmp = Number(a.done) - Number(b.done);
          break;
        case "done_desc":
          cmp = Number(b.done) - Number(a.done);
          break;
      }
      return cmp;
    });
    return items;
  }, [collection.items, sortOption]);

  return (
    <CollectionView
      collection={{ ...collection, items: sortedItems }}
      idsToDelete={idsToDeleteState}
      showDialogs={{
        collection: showCollectionDeleteDialog,
        single: showSingleDeleteDialog,
        multi: showMultiDeleteDialog,
      }}
      deletingId={deletingId}
      dialogHandlers={dialogHandlers}
      itemHandlers={itemHandlers}
      sortOption={sortOption}
      setSortOption={setSortOption}
    />
  );
}
