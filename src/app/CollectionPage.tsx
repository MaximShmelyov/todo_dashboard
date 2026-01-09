'use server'

import {Collection, CollectionType} from "@prisma/client";
import {getSession} from "@/src/lib/auth"
import AddItemForm from "@/src/components/common/AddItemForm";
import CollectionClient from "@/src/app/CollectionClient";
import {CollectionExtended, getCollection} from "@/src/db/actions/collections";

export default async function CollectionPage({collectionType, params, searchParams}: {
  collectionType: CollectionType,
  params: Promise<{ id: string }>,
  searchParams: Promise<{ create?: string }>
}) {
  const session = await getSession();
  const paramsObj = await params;
  const searchParamsObj = await searchParams;
  if (!session) return "Loading";
  if (!paramsObj.id) return <div>No ID provided</div>;

  const collection: CollectionExtended = await getCollection(paramsObj.id, collectionType);
  const showForm = searchParamsObj.create === "1";

  if (!collection) return <div>404 Not Found</div>;

  return (
    <>
      <CollectionClient collection={collection}/>
      {showForm && <AddItemForm collectionType={collectionType} collectionId={collection.id}/>}
    </>
  );
}