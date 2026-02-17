"use client";

import { CollectionType } from "@prisma/client";
import Form from "next/form";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

import ModalDialog from "@/src/components/common/ModalDialog";
import ModalDialogTitle from "@/src/components/common/ModalDialogTitle";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Textarea from "@/src/components/ui/Textarea";
import { createItem } from "@/src/db/actions/item";
import { getCollectionRoute, getLabelOfCollectionType } from "@/src/lib/utils";

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
  const titleInputRef = useRef<HTMLInputElement>(null);

  return (
    <ModalDialog
      initialFocus={titleInputRef as React.RefObject<HTMLElement>}
      onCloseAction={() => router.back()}
    >
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

        <div className="flex flex-col gap-1">
          <label htmlFor="create_form_title" className="font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="create_form_title"
            name="title"
            placeholder="Enter a title"
            required
            aria-required="true"
            ref={titleInputRef}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="create_form_body" className="font-medium">
            Description <span className="text-gray-400 text-sm">(optional)</span>
          </label>
          <Textarea
            id="create_form_body"
            name="body"
            placeholder="You can add details (optional)"
            aria-required="false"
          />
        </div>

        <Button type="submit">Submit</Button>
      </Form>
    </ModalDialog>
  );
}
