import CreateCollectionForm from "@/src/components/common/CreateCollectionForm"
import {getNoteList} from "@/src/db/actions/notes";
import CollectionsClient from "@/src/app/CollectionsClient";
import {CollectionType} from "@prisma/client";

export default async function Notes({
                                             searchParams,
                                           }: {
  searchParams: Promise<{ create?: string }>
}) {
  const params = await searchParams;
  const showForm = params.create === "1";

  return (
    <>
      <CollectionsClient label="Notes" collectionType={CollectionType.NOTE} items={await getNoteList()}/>
      {showForm && <CreateCollectionForm collectionType={CollectionType.NOTE} />}
    </>
  )
}
