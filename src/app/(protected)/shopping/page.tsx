import { CollectionType } from "@prisma/client";

import CollectionsClient from "@/src/app/CollectionsClient";
import CreateCollectionForm from "@/src/components/common/CreateCollectionForm";
import PleaseLogIn from "@/src/components/common/PleaseLogIn";
import { getShoppingList } from "@/src/db/actions/shopping";
import { getSession } from "@/src/lib/auth";
import { getPageMetadata } from "@/src/lib/metadata";

export const metadata = getPageMetadata({
  title: "Shopping list",
});

export default async function ShoppingPage({
  searchParams,
}: {
  searchParams: Promise<{ create?: string }>;
}) {
  const params = await searchParams;
  const showForm = params.create === "1";
  const session = await getSession();
  if (!session || !session.user) {
    return <PleaseLogIn />;
  }

  return (
    <>
      <CollectionsClient
        label="🛍 Shopping list"
        collectionType={CollectionType.SHOPPING}
        items={await getShoppingList()}
      />
      {showForm && <CreateCollectionForm collectionType={CollectionType.SHOPPING} />}
    </>
  );
}
