import AddButton from "@/src/components/ui/buttons/AddButton";
import Button from "@/src/components/ui/Button";
import { getLabelOfCollectionType } from "@/src/lib/utils";
import { CollectionType } from "@prisma/client";

export default function FooterActions({
  onAddHref,
  onDeleteCollection,
  collectionType,
}: {
  onAddHref: string;
  onDeleteCollection: () => void;
  collectionType: CollectionType;
}) {
  return (
    <>
      <div className="flex flex-row mx-auto justify-center">
        <AddButton href={onAddHref} aria-label="Add item">
          Add item
        </AddButton>
      </div>
      <div className="flex mt-8 px-2">
        <Button onClick={onDeleteCollection} variant="delete" className="ml-auto">
          {`Delete ${getLabelOfCollectionType(collectionType)}`}
        </Button>
      </div>
    </>
  );
}
