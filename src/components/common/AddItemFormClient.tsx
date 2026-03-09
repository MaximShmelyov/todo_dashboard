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
  const [multiMode, setMultiMode] = useState(false);
  const [multiValue, setMultiValue] = useState("");

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

          if (multiMode) {
            const lines = multiValue
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean);

            for (const line of lines) {
              await createItem({
                title: line,
                body: "",
                collectionId,
                createdById: ownerId,
              });
            }
          } else {
            const formData = new FormData(e.currentTarget);
            await createItem({
              title: formData.get("title")!.toString(),
              body: formData.get("body")!.toString(),
              collectionId,
              createdById: ownerId,
            });
          }

          const params = new URLSearchParams(searchParams.toString());
          params.delete("create");
          const query = params.toString();
          const basePath = `${getCollectionRoute(collectionType)}/${collectionId}`;
          router.push(query ? `${basePath}?${query}` : basePath);
        }}
      >
        <ModalDialogTitle>
          {multiMode
            ? `Add multiple items to ${getLabelOfCollectionType(collectionType)}`
            : `Add item to ${getLabelOfCollectionType(collectionType)}`}
        </ModalDialogTitle>

        <Button
          type="button"
          variant="secondary"
          onClick={() => setMultiMode((v) => !v)}
          className="self-end"
          disabled={loading}
        >
          {multiMode ? "Single mode" : "Multi mode"}
        </Button>

        {multiMode ? (
          <div className="flex flex-col gap-1">
            <label htmlFor="multi_form_titles" className="font-medium">
              One item per line <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="multi_form_titles"
              name="multi_titles"
              placeholder="Enter each item on a new line"
              required
              aria-required="true"
              value={multiValue}
              onChange={(e) => setMultiValue(e.target.value)}
              disabled={loading}
              rows={6}
            />
          </div>
        ) : (
          <>
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
          </>
        )}

        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </form>
    </ModalDialog>
  );
}
