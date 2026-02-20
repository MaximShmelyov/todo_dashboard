"use client";

import { CollectionType, Family } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

import ModalDialog from "@/src/components/common/ModalDialog";
import ModalDialogTitle from "@/src/components/common/ModalDialogTitle";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Select from "@/src/components/ui/Select";
import { createNote } from "@/src/db/actions/notes";
import { createShopping } from "@/src/db/actions/shopping";
import { createTodo } from "@/src/db/actions/todos";
import { getCollectionRoute, getLabelOfCollectionType } from "@/src/lib/utils";

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
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  return (
    <ModalDialog
      initialFocus={initialFocusRef as React.RefObject<HTMLElement>}
      onCloseAction={() => router.back()}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const formData = new FormData(e.currentTarget);
          await createCollection(
            collectionType,
            formData.get("title")!.toString(),
            formData.get("familyId")?.toString() || undefined,
          );
          router.push(getCollectionRoute(collectionType));
        }}
      >
        <ModalDialogTitle>Create a {getLabelOfCollectionType(collectionType)}</ModalDialogTitle>
        <label className="flex flex-col gap-1">
          <span className="flex items-center gap-1">
            Title <span className="text-red-500">*</span>
          </span>
          <Input
            id="create_form_title"
            data-testId="title-input"
            name="title"
            placeholder="Enter title"
            maxLength={30}
            required
            aria-required="true"
            ref={initialFocusRef}
            disabled={loading}
          />
        </label>
        <label className="flex flex-col gap-1">
          Family:
          <Select name="familyId" defaultValue="" disabled={loading}>
            <option value="">Private (no family)</option>
            {families.map((family) => (
              <option key={family.id} value={family.id}>
                {family.name}
              </option>
            ))}
          </Select>
        </label>
        <Button type="submit" loading={loading}>
          Create
        </Button>
      </form>
    </ModalDialog>
  );
}
