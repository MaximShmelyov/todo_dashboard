"use client";

import { CollectionType } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";

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
  const searchParams = useSearchParams();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  return (
    <ModalDialog
      initialFocus={titleInputRef as React.RefObject<HTMLElement>}
      onCloseAction={() => router.back()}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const formData = new FormData(e.currentTarget);
          await createItem({
            title: formData.get("title")!.toString(),
            body: formData.get("body")!.toString(),
            collectionId,
            createdById: ownerId,
          });

          const params = new URLSearchParams(searchParams.toString());
          params.delete("create");
          const query = params.toString();
          const basePath = `${getCollectionRoute(collectionType)}/${collectionId}`;
          router.push(query ? `${basePath}?${query}` : basePath);
        }}
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </form>
    </ModalDialog>
  );
}
