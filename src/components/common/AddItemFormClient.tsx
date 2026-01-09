"use client"

import {useRouter} from "next/navigation"
import Form from "next/form"
import Input from "@/src/components/ui/Input";
import {getCollectionRoute, getLabelOfCollectionType} from "@/src/lib/utils";
import {createItem} from "@/src/db/actions/item";
import {CollectionType} from "@prisma/client";

export default function AddItemFormClient({collectionType, collectionId, ownerId}: {
  collectionType: CollectionType,
  collectionId: string,
  ownerId: string,
}) {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center"
      onClick={() => router.back()}
    >
      <div className="rounded-xl bg-white shadow-lg p-6" onClick={e => e.stopPropagation()}>
        <Form
          action={async (formData) => {
            await createItem({
              title: formData.get('title')!.toString(),
              body: formData.get('body')!.toString(),
              collectionId,
              createdById: ownerId,
            });
            router.push(`${getCollectionRoute(collectionType)}/${collectionId}`);
          }}
          className="flex flex-col gap-4"
        >
          <h3 className="text-lg mb-4">Add item to {getLabelOfCollectionType(collectionType)}</h3>
          <Input
            id="create_form_title"
            name="title"
            placeholder="Title"
            required/>
          <Input
            id="create_form_body"
            name="body"
            placeholder="Body"/>

          <button
            className="rounded-lg border border-stone-100 hover:bg-stone-200"
            type="submit"
          >
            Submit
          </button>
        </Form>
      </div>
    </div>
  )
}
