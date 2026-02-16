import ConfirmPopup from "@/src/components/layout/ConfirmPopup";
import { getLabelOfCollectionType } from "@/src/lib/utils";
import { CollectionExtended } from "@/src/db/actions/collections";

type Props = {
  collection: NonNullable<CollectionExtended>;
  showDialogs: { collection: boolean; single: boolean; multi: boolean };
  deletingId: string;
  dialogHandlers: {
    collection: { cancel: () => void; confirm: () => void };
    single: { confirm: (id: string) => void; cancel: () => void };
    multi: { confirm: () => void; cancel: () => void };
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
      {showDialogs.multi && (
        <ConfirmPopup
          title="Are you sure?"
          onConfirmAction={dialogHandlers.multi.confirm}
          onCancelAction={dialogHandlers.multi.cancel}
        />
      )}
    </>
  );
}
