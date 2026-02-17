import { Item } from "@prisma/client";

import AddButton from "@/src/components/ui/buttons/AddButton";
import BackNavigation from "@/src/components/ui/buttons/BackNavigation";
import { CollectionExtended } from "@/src/db/actions/collections";
import { getCollectionRoute } from "@/src/lib/utils";

import CollectionDescription from "./CollectionDescription";
import CollectionTitle from "./CollectionTitle";
import DeleteSelectedButton from "./DeleteSelectedButton";
import Dialogs from "./Dialogs";
import FooterActions from "./FooterActions";
import ItemList from "./ItemList";
import SortSelector from "./SortSelector";

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

export default function CollectionView(props: Props) {
  return (
    <>
      <Dialogs {...props} />
      <div className="w-full max-w-full overflow-x-hidden px-2">
        <BackNavigation href={getCollectionRoute(props.collection.type)} />
        <div className="flex flex-wrap items-center justify-between gap-2 w-full min-w-0 mb-2">
          <CollectionTitle {...props} />
          <div className="flex gap-2 items-center">
            <AddButton href="?create=1" aria-label="Add item">
              Add item
            </AddButton>
            <DeleteSelectedButton
              count={props.idsToDelete.length}
              onClick={props.dialogHandlers.multi.open}
            />
          </div>
        </div>
        <CollectionDescription collection={props.collection} />
        <SortSelector sortOption={props.sortOption} setSortOption={props.setSortOption} />
        <div className="mt-2 py-2 shadow-sm rounded-sm w-full max-w-full">
          <ItemList {...props} />
        </div>
        <div className="flex mt-8 px-2">
          <FooterActions
            onDeleteCollection={props.dialogHandlers.collection.open}
            collectionType={props.collection.type}
          />
        </div>
      </div>
    </>
  );
}
