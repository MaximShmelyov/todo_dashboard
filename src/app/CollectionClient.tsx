"use client";

import { Item } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useReducer, useState, useMemo } from "react";

import {
  CollectionExtended,
  deleteCollection,
  updateCollection,
} from "@/src/db/actions/collections";
import { deleteItem, deleteItems, multiUpdate, updateItem } from "@/src/db/actions/item";
import { getCollectionRoute } from "@/src/lib/utils";

import CollectionView from "./CollectionView";

type AddAction = { id: string; type: "ADD" };
type RemoveAction = { id: string; type: "REMOVE" };
type ClearAction = { type: "CLEAR" };

const initialIdsToModify: string[] = [];

function idsToModifyReducer(
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
  const [idsToModifyState, idsToModifyDispatch] = useReducer(
    idsToModifyReducer,
    initialIdsToModify,
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [editingBodyId, setEditingBodyId] = useState<string | null>(null);
  const [editingBodyValue, setEditingBodyValue] = useState<string>("");
  const [editingCollectionTitle, setEditingCollectionTitle] = useState(false);
  const [collectionTitleValue, setCollectionTitleValue] = useState(collection.title);

  function getUpdatedQuery(updated: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updated).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    return `?${params.toString()}`;
  }

  const addItemHref = getUpdatedQuery({ create: "1" });

  const sortFromQuery = searchParams.get("sort") as SortOption | null;
  const sortOption: SortOption = sortFromQuery ?? "created_desc";

  const setSortOption = (option: SortOption) => {
    router.replace(getUpdatedQuery({ sort: option }), { scroll: false });
  };

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
    multiDelete: {
      open: () => setShowMultiDeleteDialog(true),
      confirm: async () => {
        await deleteItems(idsToModifyState);
        router.refresh();
        setShowMultiDeleteDialog(false);
        idsToModifyDispatch({ type: "CLEAR" });
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
      idsToModifyDispatch({
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

  const multiItemsHandlers = {
    markDone: async () => {
      await multiUpdate(idsToModifyState, { done: true });
      router.refresh();
      idsToModifyDispatch({ type: "CLEAR" });
    },
  };

  const collectionHandlers = {
    editTitle: async (title: string) => {
      await updateCollection({ id: collection.id, title });
      router.refresh();
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
      idsToModify={idsToModifyState}
      showDialogs={{
        collection: showCollectionDeleteDialog,
        single: showSingleDeleteDialog,
        multiDelete: showMultiDeleteDialog,
      }}
      deletingId={deletingId}
      addItemHref={addItemHref}
      dialogHandlers={dialogHandlers}
      itemHandlers={itemHandlers}
      multiItemsHandlers={multiItemsHandlers}
      collectionHandlers={collectionHandlers}
      sortOption={sortOption}
      setSortOption={setSortOption}
      editingId={editingId}
      setEditingId={setEditingId}
      editingValue={editingValue}
      setEditingValue={setEditingValue}
      editingBodyId={editingBodyId}
      setEditingBodyId={setEditingBodyId}
      editingBodyValue={editingBodyValue}
      setEditingBodyValue={setEditingBodyValue}
      editingCollectionTitle={editingCollectionTitle}
      setEditingCollectionTitle={setEditingCollectionTitle}
      collectionTitleValue={collectionTitleValue}
      setCollectionTitleValue={setCollectionTitleValue}
    />
  );
}
