import AddButton from "@/src/components/ui/buttons/AddButton";
import Button from "@/src/components/ui/Button";
import BackNavigation from "@/src/components/ui/buttons/BackNavigation";
import { getCollectionRoute, getLabelOfCollectionType } from "@/src/lib/utils";
import ConfirmPopup from "@/src/components/layout/ConfirmPopup";
import { CollectionExtended } from "@/src/db/actions/collections";
import { Item } from "@prisma/client";

type Props = {
  collection: NonNullable<CollectionExtended>;
  idsToDelete: string[];
  showDialogs: { collection: boolean; single: boolean; multi: boolean };
  deletingId: string;
  dialogHandlers: {
    collection: { open: () => void; confirm: () => void; cancel: () => void };
    single: { open: (id: string) => void; confirm: (id: string) => void; cancel: () => void };
    multi: { open: () => void; confirm: () => void; cancel: () => void };
  };
  itemHandlers: {
    toggleDone: (item: Pick<Item, "id" | "done">) => void;
    toggleSelect: (id: string, checked: boolean) => void;
    delete: (id: string) => void;
  };
};

export default function CollectionView({
  collection,
  idsToDelete,
  showDialogs,
  deletingId,
  dialogHandlers,
  itemHandlers,
}: Props) {
  return (
    <>
      {showDialogs.collection && (
        <ConfirmPopup
          title={`Delete ${getLabelOfCollectionType(collection.type)}`}
          onCancelAction={dialogHandlers.collection.cancel}
          onConfirmAction={dialogHandlers.collection.confirm}
        />
      )}
      {showDialogs.single && (
        <ConfirmPopup
          title="Are you sure?"
          onConfirmAction={() => dialogHandlers.single.confirm(deletingId)}
          onCancelAction={dialogHandlers.single.cancel}
        />
      )}
      {showDialogs.multi && (
        <ConfirmPopup
          title="Are you sure?"
          onConfirmAction={dialogHandlers.multi.confirm}
          onCancelAction={dialogHandlers.multi.cancel}
        />
      )}
      <div className="w-full max-w-full overflow-x-hidden px-2">
        <BackNavigation href={getCollectionRoute(collection.type)} />
        <div className="flex flex-wrap items-start justify-between gap-2 w-full min-w-0 mb-2">
          <div className="text-lg font-semibold min-w-0 break-words">{collection.title}</div>
          {idsToDelete.length !== 0 && (
            <Button
              onClick={dialogHandlers.multi.open}
              variant={"delete"}
              className="shrink-0 max-w-full"
            >
              {`Delete selected (${idsToDelete.length})`}
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
                        checked={idsToDelete.includes(item.id)}
                        onChange={(e) => itemHandlers.toggleSelect(item.id, e.target.checked)}
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
                          onClick={() => itemHandlers.toggleDone(item)}
                          aria-label="Change status"
                          title={item.done ? "Done ✔" : "Todo"}
                        >
                          {item.done ? "Done ✔" : "Todo"}
                        </Button>
                        <Button
                          className="!p-1 !rounded-xl !text-xs min-w-0 max-w-[80px] px-2 truncate"
                          onClick={() => itemHandlers.delete(item.id)}
                          title="Delete"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    {item.body && (
                      <div
                        className={`ml-0 sm:ml-4 mt-1 italic text-sm break-words break-all ${
                          item.done ? "line-through text-gray-400" : ""
                        }`}
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
            <Button onClick={dialogHandlers.collection.open} variant={"delete"} className="ml-auto">
              {`Delete ${getLabelOfCollectionType(collection.type)}`}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
