"use client";

import { useRouter } from "next/navigation";
import Form from "next/form";
import Input from "@/src/components/ui/Input";
import { getCollectionRoute, getLabelOfCollectionType } from "@/src/lib/utils";
import { createItem } from "@/src/db/actions/item";
import { CollectionType } from "@prisma/client";
import Button from "@/src/components/ui/Button";
import ModalDialog from "@/src/components/common/ModalDialog";
import ModalDialogTitle from "@/src/components/common/ModalDialogTitle";

export default function AddItemFormClient({
  collectionType,
  collectionId,
  ownerId,
}: {
  collectionType: CollectionType;
  collectionId: string;
  ownerId: string;
}) {
  const router = useRouter();

  return (
    <ModalDialog onCloseAction={() => router.back()}>
      <Form
        action={async (formData) => {
          await createItem({
            title: formData.get("title")!.toString(),
            body: formData.get("body")!.toString(),
            collectionId,
            createdById: ownerId,
          });
          router.push(`${getCollectionRoute(collectionType)}/${collectionId}`);
        }}
        className="flex flex-col gap-4"
      >
        <ModalDialogTitle>Add item to {getLabelOfCollectionType(collectionType)}</ModalDialogTitle>
        <Input id="create_form_title" name="title" placeholder="Title" required />
        <Input id="create_form_body" name="body" placeholder="Body" />

        <Button type="submit">Submit</Button>
      </Form>
    </ModalDialog>
  );
}
