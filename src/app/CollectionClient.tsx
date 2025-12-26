'use client'

import AddButton from "@/src/components/ui/buttons/AddButton";
import {Collection} from "@prisma/client";
import {getCollectionRoute} from "@/src/lib/utils";
import BackNavigation from "@/src/components/ui/buttons/BackNavigation";
import {useReducer, useState} from "react";
import ConfirmPopup from "@/src/components/layout/ConfirmPopup";
import {deleteItem, deleteItems} from "@/src/db/actions/item";
import {useRouter} from "next/navigation";

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

export default function CollectionClient({collection}: {
  collection: Collection
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMultiDeleteDialog, setShowMultiDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string>("");
  const [idsToDeleteState, idsToDeleteDispatch] = useReducer(idsToDeleteReducer, initialIdsToDelete);
  const router = useRouter();

  // Single delete
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
      {showDeleteDialog &&
        <ConfirmPopup title="Are you sure?" onConfirm={() => onDeleteConfirm(deletingId)} onCancel={onDeleteCancel}/>}
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
        <div>{collection.family?.title ?? '(private)'}</div>
        <div className="mt-2 py-2 shadow-sm rounded-sm">
          <ul className="flex flex-col gap-2 p-2">
            {collection.items.map(item => (
              <li
                className="hover:bg-gray-100 p-2 rounded-sm"
                key={item.id}
              >
                <div className="flex flex-row justify-between gap-2">
                  <input
                    className="w-5"
                    type="checkbox"
                    onChange={(e) => {
                      idsToDeleteDispatch(
                        {
                          id: item.id,
                          type: e.target.checked ? 'ADD' : 'REMOVE',
                        });
                    }}
                  />
                  <div className="flex-1 font-semibold">• {item.title}</div>
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