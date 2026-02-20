import ConfirmPopup from "@/src/components/layout/ConfirmPopup";
import { CollectionExtended } from "@/src/db/actions/collections";
import { getLabelOfCollectionType } from "@/src/lib/utils";

type Props = {
  collection: NonNullable<CollectionExtended>;
  showDialogs: { collection: boolean; single: boolean; multiDelete: boolean };
  deletingId: string;
  dialogHandlers: {
    collection: { cancel: () => void; confirm: () => void };
    single: { confirm: (id: string) => void; cancel: () => void };
    multiDelete: { confirm: () => void; cancel: () => void };
  };
};

export default function Dialogs({ collection, showDialogs, deletingId, dialogHandlers }: Props) {
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
      {showDialogs.multiDelete && (
        <ConfirmPopup
          title="Are you sure?"
          onConfirmAction={dialogHandlers.multiDelete.confirm}
          onCancelAction={dialogHandlers.multiDelete.cancel}
        />
      )}
    </>
  );
}
