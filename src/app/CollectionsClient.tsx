"use client";

import { CollectionType } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";

import AddButton from "@/src/components/ui/buttons/AddButton";
import BackNavigation from "@/src/components/ui/buttons/BackNavigation";
import VerticalList from "@/src/components/ui/list/VerticalList";
import VerticalListItem from "@/src/components/ui/list/VerticalListItem";
import { CollectionsExtended } from "@/src/db/actions/collections";
import { getCollectionRoute } from "@/src/lib/utils";

export default function CollectionsClient({
  label,
  collectionType,
  items,
}: {
  label: string;
  collectionType: CollectionType;
  items: CollectionsExtended;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="font-semibold">
          <BackNavigation href="/" />
          <h2 className="inline text-2xl">{label}</h2>
        </div>
        <AddButton href="?create=1">New</AddButton>
      </div>

      {!items.length && <p>This list is empty. Add your first item!</p>}
      {items.length > 0 && (
        <VerticalList>
          <AnimatePresence initial={true}>
            {items.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <VerticalListItem href={`${getCollectionRoute(collectionType)}/${item.id}`}>
                  <div>
                    <span>{item.title}</span>
                  </div>
                  <span className="text-sm">{item.family?.name ?? "(private)"}</span>
                </VerticalListItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </VerticalList>
      )}
    </div>
  );
}
