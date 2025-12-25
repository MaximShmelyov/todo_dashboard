import CreateCollectionForm from "@/src/components/common/CreateCollectionForm"
import {CollectionType} from "@prisma/client";
import {getShoppingList} from "@/src/db/actions/shopping";
import CollectionsClient from "@/src/app/CollectionsClient";
import {getSession} from "@/src/lib/auth";
import PleaseLogIn from "@/src/components/common/PleaseLogIn";

export default async function ShoppingPage({
                                             searchParams,
                                           }: {
  searchParams: Promise<{ create?: string }>
}) {
  const params = await searchParams;
  const showForm = params.create === "1";
  const session = await getSession();
  if (!session || !session.user) {
    return <PleaseLogIn/>;
  }

  return (
    <>
      <CollectionsClient label="🛍 Shopping list" collectionType={CollectionType.SHOPPING} items={await getShoppingList()}/>
      {showForm && <CreateCollectionForm collectionType={CollectionType.SHOPPING} />}
    </>
  )
}
