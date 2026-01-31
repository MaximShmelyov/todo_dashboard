"use client";

import { useRouter } from "next/navigation";
import Form from "next/form";
import { CollectionType, Family } from "@prisma/client";
import { createShopping } from "@/src/db/actions/shopping";
import Input from "@/src/components/ui/Input";
import { createNote } from "@/src/db/actions/notes";
import { getCollectionRoute, getLabelOfCollectionType } from "@/src/lib/utils";
import { createTodo } from "@/src/db/actions/todos";
import Button from "@/src/components/ui/Button";
import ModalDialog from "@/src/components/common/ModalDialog";
import ModalDialogTitle from "@/src/components/common/ModalDialogTitle";

const exhaustiveGuardCollectionType = (_: never): never => {
  throw new Error("Got unexpected value here.");
};

function createCollection(
  collectionType: CollectionType,
  title: string,
  familyId?: string,
): Promise<void> {
  switch (collectionType) {
    case "NOTE":
      return createNote(title, familyId ?? null);
    case "SHOPPING":
      return createShopping(title, familyId ?? null);
    case "TODO":
      return createTodo(title, familyId ?? null);
    default:
      return exhaustiveGuardCollectionType(collectionType);
  }
}

export default function CreateCollectionFormClient({
  collectionType,
  families,
}: {
  collectionType: CollectionType;
  families: Family[];
}) {
  const router = useRouter();

  return (
    <ModalDialog onCloseAction={() => router.back()}>
      <Form
        action={async (formData) => {
          await createCollection(
            collectionType,
            formData.get("title")!.toString(),
            formData.get("familyId")?.toString() || undefined,
          );
          router.push(getCollectionRoute(collectionType));
        }}
        className="flex flex-col gap-4"
      >
        <ModalDialogTitle>Create a {getLabelOfCollectionType(collectionType)}</ModalDialogTitle>
        <Input id="create_form_title" name="title" placeholder="Title" maxLength={30} required />

        <select
          className="rounded-lg hover:bg-stone-100 dark:hover:bg-gray-600 h-10"
          name="familyId"
          defaultValue=""
        >
          <option value="" className="dark:bg-gray-600">
            Private
          </option>
          {families.map((family) => (
            <option key={family.id} value={family.id} className="dark:bg-gray-600">
              {family.name}
            </option>
          ))}
        </select>

        <Button type="submit">Create</Button>
      </Form>
    </ModalDialog>
  );
}
