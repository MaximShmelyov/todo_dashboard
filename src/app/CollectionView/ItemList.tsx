import { AnimatePresence, motion } from "framer-motion";

import { CollectionExtended } from "@/src/db/actions/collections";

import ItemRow from "./ItemRow";

import type { Item } from "@prisma/client";

type Props = {
  collection: NonNullable<CollectionExtended>;
  idsToModify: string[];
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

export default function ItemList(props: Props) {
  const { collection } = props;
  return (
    <motion.ul
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="flex flex-col gap-2 p-2 w-full max-w-full"
    >
      <AnimatePresence initial={false}>
        {collection.items.length > 0
          ? collection.items.map((item) => <ItemRow key={item.id} item={item} {...props} />)
          : "No items yet"}
      </AnimatePresence>
    </motion.ul>
  );
}
