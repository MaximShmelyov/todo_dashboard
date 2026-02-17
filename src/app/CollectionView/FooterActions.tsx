import { CollectionType } from "@prisma/client";

import Button from "@/src/components/ui/Button";
import { getLabelOfCollectionType } from "@/src/lib/utils";

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
