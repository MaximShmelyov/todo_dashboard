'use server'

import {Collection, CollectionType} from "@prisma/client";
import {getSession} from "@/src/lib/auth"
import {getShopping} from "@/src/db/actions/shopping";
import AddItemForm from "@/src/components/common/AddItemForm";
import CollectionClient from "@/src/app/CollectionClient";

const collectionType = CollectionType.SHOPPING;

export default async function ShoppingList({params, searchParams}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ create?: string }>
}) {
  const session = await getSession();
  const paramsObj = await params;
  const searchParamsObj = await searchParams;
  if (!session) return "Loading";
  if (!paramsObj.id) return <div>No ID provided</div>;

  const shopping: Collection = await getShopping(paramsObj.id);
  const showForm = searchParamsObj.create === "1";

  if (!shopping) return <div>404 Not Found</div>;

  return (
    <>
      <CollectionClient collection={shopping}/>
      {showForm && <AddItemForm collectionType={collectionType} collectionId={shopping.id}/>}
    </>
  );
}