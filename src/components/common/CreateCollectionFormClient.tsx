"use client"

import {useRouter} from "next/navigation"
import Form from "next/form"
import {CollectionType, Family} from "@prisma/client";
import {createShopping} from "@/src/db/actions/shopping";
import Input from "@/src/components/ui/Input";
import {createNote} from "@/src/db/actions/notes";
import {getCollectionRoute, getLabelOfCollectionType} from "@/src/lib/utils";

function createCollection(collectionType: CollectionType, title: string, familyId?: string): Promise<void> {
  switch (collectionType) {
    case "NOTE":
      return createNote(title, familyId);
    case "SHOPPING":
      return createShopping(title, familyId);
    case "TODO":
      return;
    // return createTodo(title, familyId);
    default:
      return exhaustiveGuardCollectionType(collectionType);
  }
}

export default function CreateCollectionFormClient({collectionType, families}: {
  collectionType: CollectionType,
  families: Family[]
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
            await createCollection(
              collectionType,
              formData.get('title').toString(),
              formData.get('familyId')?.toString() || null);
            router.push(getCollectionRoute(collectionType));
          }}
          className="flex flex-col gap-4"
        >
          <h3 className="text-lg mb-4">Create a {getLabelOfCollectionType(collectionType)}</h3>
          {/*<label htmlFor="create_form_title">Name</label>*/}
          <Input
            id="create_form_title"
            name="title"
            placeholder="Title"
            required/>

          <select
            className="rounded-lg hover:bg-stone-100"
            name="familyId"
            defaultValue=""
          >
            <option value="">Private</option>
            {families.map(family => (
              <option key={family.id} value={family.id}>
                {family.name}
              </option>
            ))}
          </select>

          <button
            className="rounded-lg border border-stone-100 hover:bg-stone-200"
            type="submit"
          >
            Create
          </button>
        </Form>
      </div>
    </div>
  )
}
