import Button from "@/src/components/ui/Button";
import { getLabelOfCollectionType } from "@/src/lib/utils";
import { CollectionType } from "@prisma/client";

export default function FooterActions({
  onDeleteCollection,
  collectionType,
}: {
  onDeleteCollection: () => void;
  collectionType: CollectionType;
}) {
  return (
    <Button onClick={onDeleteCollection} variant="delete" className="ml-auto">
      {`Delete ${getLabelOfCollectionType(collectionType)}`}
    </Button>
  );
}
