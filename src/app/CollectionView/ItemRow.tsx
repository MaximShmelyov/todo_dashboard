import { motion } from "framer-motion";

import Button from "@/src/components/ui/Button";
import InlineEditInput from "@/src/components/ui/InlineEditInput";
import InlineEditTextarea from "@/src/components/ui/InlineEditTextarea";
import { type CollectionExtended } from "@/src/db/actions/collections";

import type { Item } from "@prisma/client";

type CollectionItem = NonNullable<CollectionExtended>["items"][number];

type Props = {
  item: CollectionItem;
  idsToDelete: string[];
  itemHandlers: {
    toggleDone: (item: Pick<Item, "id" | "done">) => void;
    toggleSelect: (id: string, checked: boolean) => void;
    editTitle: (id: string, title: string) => void;
    editBody: (id: string, body: string) => void;
    delete: (id: string) => void;
  };
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  editingValue: string;
  setEditingValue: (v: string) => void;
  editingBodyId: string | null;
  setEditingBodyId: (id: string | null) => void;
  editingBodyValue: string;
  setEditingBodyValue: (v: string) => void;
};

export default function ItemRow({
  item,
  idsToDelete,
  itemHandlers,
  editingId,
  setEditingId,
  editingValue,
  setEditingValue,
  editingBodyId,
  setEditingBodyId,
  editingBodyValue,
  setEditingBodyValue,
}: Props) {
  return (
    <motion.li
      layout
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
            title={item.body && item.body.trim() !== "" ? "Edit description" : "Add description"}
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
        by {item.createdBy.name ?? "Unknown"}
      </div>
    </motion.li>
  );
}
