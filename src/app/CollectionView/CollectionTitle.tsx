import InlineEditInput from "@/src/components/ui/InlineEditInput";

type Props = {
  collection: { title: string };
  editingCollectionTitle: boolean;
  setEditingCollectionTitle: (v: boolean) => void;
  collectionTitleValue: string;
  setCollectionTitleValue: (v: string) => void;
  collectionHandlers: { editTitle: (title: string) => void };
};

export default function CollectionTitle({
  collection,
  editingCollectionTitle,
  setEditingCollectionTitle,
  collectionTitleValue,
  setCollectionTitleValue,
  collectionHandlers,
}: Props) {
  return (
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
  );
}
