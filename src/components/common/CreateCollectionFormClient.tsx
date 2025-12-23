"use client"

import {useRouter} from "next/navigation"
import Form from "next/form"
import {CollectionType, Family} from "@prisma/client";
import {createCollection} from "@/src/db/actions/collections";
import {createShopping} from "@/src/db/actions/shopping";

function getLabelOfCollectionType(collectionType: CollectionType): string {
  const exhaustiveGuard = (_: never): never => {
    throw new Error('Got unexpected value here.');
  };

  switch (collectionType) {
    case "NOTE":
      return "note"
    case "SHOPPING":
      return "shopping list"
    case "TODO":
      return "todo list";
    default:
      return exhaustiveGuard(collectionType);
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
            await createShopping(
              formData.get('title').toString(),
              formData.get('familyId')?.toString() || null);
            router.push("/shopping");
          }}
          className="flex flex-col gap-4"
        >
          <h3 className="text-lg mb-4">Create a {getLabelOfCollectionType(collectionType)}</h3>
          {/*<label htmlFor="create_form_title">Name</label>*/}
          <input
            className="rounded-lg px-2 hover:bg-stone-100"
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
              <option key={family.id}>
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
