'use client'

import AddButton from "@/src/components/ui/buttons/AddButton";
import {Collection, Item} from "@prisma/client";
import {getCollectionRoute, getLabelOfCollectionType} from "@/src/lib/utils";
import BackNavigation from "@/src/components/ui/buttons/BackNavigation";
import {useReducer, useState} from "react";
import ConfirmPopup from "@/src/components/layout/ConfirmPopup";
import {deleteItem, deleteItems, updateItem} from "@/src/db/actions/item";
import {useRouter} from "next/navigation";
import {deleteCollection} from "@/src/db/actions/collections";

type AddAction = { id: string, type: 'ADD' };
type RemoveAction = { id: string, type: 'REMOVE' };
type ClearAction = { type: 'CLEAR' };

const initialIdsToDelete: string[] = [];

function idsToDeleteReducer(state: string[], action: AddAction & RemoveAction & ClearAction): string[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.id];
    case 'REMOVE':
      return state.filter(id => id !== action.id);
    case 'CLEAR':
      return [];
  }
}

const toggleItemDone = async (item: Item): Promise<void> => {
  await updateItem({ id: item.id, done: !item.done });
}

export default function CollectionClient({collection}: {
  collection: Collection
}) {
  const [showCollectionDeleteDialog, setShowCollectionDeleteDialog] = useState(false);
  const [showSingleDeleteDialog, setShowSingleDeleteDialog] = useState(false);
  const [showMultiDeleteDialog, setShowMultiDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string>("");
  const [idsToDeleteState, idsToDeleteDispatch] = useReducer(idsToDeleteReducer, initialIdsToDelete);
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
  }

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
  }

  // Multi delete
  const onMultiDelete = () => {
    setShowMultiDeleteDialog(true);
  };
  const onMultiDeleteConfirm = async () => {
    console.warn(`Deleting: ${idsToDeleteState}`);
    await deleteItems(idsToDeleteState);
    router.refresh();
    setShowMultiDeleteDialog(false);
    idsToDeleteDispatch({type: 'CLEAR'});
  }
  const onMultiDeleteCancel = async () => {
    setShowMultiDeleteDialog(false);
  }

  return (
    <>
      {showCollectionDeleteDialog &&
        <ConfirmPopup title={`Delete ${getLabelOfCollectionType(collection.type)}`} onCancel={onCollectionDeleteCancel}
                      onConfirm={onCollectionDeleteConfirm}/>}
      {showSingleDeleteDialog &&
        <ConfirmPopup title="Are you sure?" onConfirm={() => onSingleDeleteConfirm(deletingId)}
                      onCancel={onSingleDeleteCancel}/>}
      {showMultiDeleteDialog &&
        <ConfirmPopup title="Are you sure?" onConfirm={onMultiDeleteConfirm} onCancel={onMultiDeleteCancel}/>}
      <div className="">
        <BackNavigation href={getCollectionRoute(collection.type)}/>
        <div className="flex flex-row justify-between">
          <div className="text-lg font-semibold">{collection.title}</div>
          {idsToDeleteState.length !== 0 && <button
            onClick={onMultiDelete}
            className="rounded-lg bg-red-500 hover:bg-red-600 px-2 text-white"
          >
            Delete selected
          </button>}
        </div>
        <div>{collection.description}</div>
        <div>{collection.family?.name ?? '(private)'}</div>
        <div className="mt-2 py-2 shadow-sm rounded-sm">
          <ul className="flex flex-col gap-2 p-2">
            {collection.items.length > 0 ? collection.items.map(item => (
              <li
                className="hover:bg-gray-100 p-2 rounded-sm shadow-xs"
                key={item.id}
              >
                <div className="flex flex-row justify-between gap-2 h-20 items-start overflow-clip">
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    onChange={(e) => {
                      idsToDeleteDispatch(
                        {
                          id: item.id,
                          type: e.target.checked ? 'ADD' : 'REMOVE',
                        });
                    }}
                  />
                  <div className={`flex-3 ${item.done ? '' : 'font-semibold'}`}>{item.title}</div>
                  <button
                    className={`flex-1 rounded-xl px-1 h-8 ${item.done ? `bg-green-200 hover:bg-green-300` : `bg-sky-200 hover:bg-sky-300`}`}
                    onClick={async () => { await toggleItemDone(item); router.refresh(); }}
                  >
                    {item.done ? 'Done' : 'Todo'}
                  </button>
                </div>
                <div className="ml-4">{item.body}</div>
                {/*<div className="ml-4">{item.dueDate && <div>Due date:{item.dueDate.toLocaleString()}</div>}</div>*/}
                {/*<div className="ml-4">{item.updatedAt && ("Modified at: " + item.updatedAt.toLocaleString())}</div>*/}
                <div className="flex flex-row mt-4 justify-between items-end">
                  <button
                    className="rounded-xl bg-red-400 px-1 text-white hover:bg-red-600"
                    onClick={() => onSingleDelete(item.id)}
                    aria-label="Delete"
                  >
                    Delete
                  </button>
                  <div className="ml-auto">{"by " + item.createdBy.name}</div>
                </div>
              </li>
            )) : 'No items yet'}
          </ul>
          <div className="flex flex-row mx-auto justify-center">
            <AddButton
              href="?create=1"
              aria-label="Add item"
            >
              +
            </AddButton>
          </div>
          <div className="flex mt-8 px-2">
            <button
              onClick={onCollectionDelete}
              className="ml-auto rounded-lg bg-red-400 hover:bg-red-600 px-1 text-white"
            >
              {`Delete ${getLabelOfCollectionType(collection.type)}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}