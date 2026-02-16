import { AnimatePresence, motion } from "framer-motion";
import InlineEditInput from "@/src/components/ui/InlineEditInput";
import InlineEditTextarea from "@/src/components/ui/InlineEditTextarea";
import AddButton from "@/src/components/ui/buttons/AddButton";
import Button from "@/src/components/ui/Button";
import BackNavigation from "@/src/components/ui/buttons/BackNavigation";
import { getCollectionRoute, getLabelOfCollectionType } from "@/src/lib/utils";
import ConfirmPopup from "@/src/components/layout/ConfirmPopup";
import { CollectionExtended } from "@/src/db/actions/collections";
import { Item } from "@prisma/client";

type SortOption =
  | "created_desc"
  | "created_asc"
  | "title_asc"
  | "title_desc"
  | "done_asc"
  | "done_desc";

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
    editTitle: (id: string, title: string) => void;
    editBody: (id: string, body: string) => void;
    delete: (id: string) => void;
  };
  collectionHandlers: {
    editTitle: (title: string) => void;
  };
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  editingValue: string;
  setEditingValue: (v: string) => void;
  editingBodyId: string | null;
  setEditingBodyId: (id: string | null) => void;
  editingBodyValue: string;
  setEditingBodyValue: (v: string) => void;
  editingCollectionTitle: boolean;
  setEditingCollectionTitle: (v: boolean) => void;
  collectionTitleValue: string;
  setCollectionTitleValue: (v: string) => void;
};

export default function CollectionView({
  collection,
  idsToDelete,
  showDialogs,
  deletingId,
  dialogHandlers,
  itemHandlers,
  collectionHandlers,
  sortOption,
  setSortOption,
  editingId,
  setEditingId,
  editingValue,
  setEditingValue,
  editingBodyId,
  setEditingBodyId,
  editingBodyValue,
  setEditingBodyValue,
  editingCollectionTitle,
  setEditingCollectionTitle,
  collectionTitleValue,
  setCollectionTitleValue,
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
          <div className="text-lg font-semibold min-w-0 break-words">
            {editingCollectionTitle ? (
              <InlineEditInput
                initialValue={collectionTitleValue}
                onSave={(val) => {
                  setEditingCollectionTitle(false);
                  setCollectionTitleValue(val);
                  collectionHandlers.editTitle(val);
                }}
                onCancel={() => setEditingCollectionTitle(false)}
                className="w-full max-w-full"
              />
            ) : (
              <span
                className="cursor-pointer"
                title="Edit collection title"
                onClick={() => setEditingCollectionTitle(true)}
              >
                {collection.title}
              </span>
            )}
          </div>
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

        {/* Sort */}
        <div className="flex gap-2 items-center my-2">
          <label htmlFor="sort-option" className="text-sm">
            Sort by:
          </label>
          <select
            id="sort-option"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="border rounded p-1 text-sm dark:bg-gray-600"
          >
            <option value="created_desc">Created (newest)</option>
            <option value="created_asc">Created (oldest)</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
            <option value="done_asc">Status (Todo first)</option>
            <option value="done_desc">Status (Done first)</option>
          </select>
        </div>

        <div className="mt-2 py-2 shadow-sm rounded-sm w-full max-w-full">
          <motion.ul
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="flex flex-col gap-2 p-2 w-full max-w-full"
          >
            <AnimatePresence initial={false}>
              {collection.items.length > 0
                ? collection.items.map((item) => (
                    <motion.li
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -24 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
                    >
                      <div className="flex flex-row items-center gap-2 w-full min-w-0">
                        <input
                          className="w-5 h-5 mt-1 shrink-0"
                          type="checkbox"
                          checked={idsToDelete.includes(item.id)}
                          onChange={(e) => itemHandlers.toggleSelect(item.id, e.target.checked)}
                        />
                        <div className="flex-1 min-w-0">
                          {editingId === item.id ? (
                            <InlineEditInput
                              initialValue={editingValue}
                              onSave={(val) => {
                                itemHandlers.editTitle(item.id, val);
                                setEditingId(null);
                              }}
                              onCancel={() => setEditingId(null)}
                              className="w-full max-w-full"
                            />
                          ) : (
                            <span
                              className={`
          block truncate break-words break-all
          ${item.done ? "line-through text-gray-400" : "font-semibold"}
          cursor-pointer
        `}
                              title={item.title}
                              onClick={() => {
                                setEditingId(item.id);
                                setEditingValue(item.title);
                              }}
                            >
                              {item.title}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-row gap-2 shrink-0 ml-2">
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
                      <div
                        className={`
    ml-0 sm:ml-4 mt-1 italic text-sm break-words break-all
    ${editingBodyId !== item.id && item.done ? "text-gray-400" : ""}
  `}
                      >
                        {editingBodyId === item.id ? (
                          <InlineEditTextarea
                            initialValue={editingBodyValue}
                            onSave={(val) => {
                              itemHandlers.editBody(item.id, val);
                              setEditingBodyId(null);
                            }}
                            onCancel={() => setEditingBodyId(null)}
                            textareaAriaLabel={"Edit description"}
                            className="w-full"
                          />
                        ) : (
                          <span
                            className={`
        flex-1 whitespace-pre-line
        ${item.body && item.body.trim() !== "" ? "" : "text-gray-400 italic"}
        ${item.done ? "line-through" : ""}
        cursor-pointer
      `}
                            title={
                              item.body && item.body.trim() !== ""
                                ? "Edit description"
                                : "Add description"
                            }
                            onClick={() => {
                              setEditingBodyId(item.id);
                              setEditingBodyValue(item.body ?? "");
                            }}
                          >
                            {item.body && item.body.trim() !== "" ? item.body : "Add description"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-2 ml-0 sm:ml-4 text-xs text-gray-500 break-words break-all">
                        by {item.createdBy.name}
                      </div>
                    </motion.li>
                  ))
                : "No items yet"}
            </AnimatePresence>
          </motion.ul>
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
