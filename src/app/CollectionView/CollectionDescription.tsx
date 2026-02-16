import { CollectionExtended } from "@/src/db/actions/collections";

export default function CollectionDescription({
  collection,
}: {
  collection: NonNullable<CollectionExtended>;
}) {
  return (
    <>
      <div className="truncate break-words">{collection.description}</div>
      <div className="truncate break-words">{collection.family?.name ?? "(private)"}</div>
    </>
  );
}
