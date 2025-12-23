import ShoppingClient from "./ShoppingClient"
import CreateCollectionForm from "@/src/components/common/CreateCollectionForm"
import {Collection} from "@prisma/client";
import { getSession } from "@/src/lib/auth";
import {getShoppingList} from "@/src/db/actions/shopping";

export default async function ShoppingPage({
                                             searchParams,
                                           }: {
  searchParams: Promise<{ create?: string }>
}) {
  const params = await searchParams;
  const showForm = params.create === "1";
  const session = await getSession();

  async function getItems(): Promise<Collection[]> {
    if (!session || !session.user) {
      return [];
    }
    return getShoppingList(session.user.id);
  }

  return (
    <>
      <ShoppingClient items={await getItems()}/>
      {showForm && <CreateCollectionForm collectionType="SHOPPING" />}
    </>
  )
}
