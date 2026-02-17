import { CollectionType } from "@prisma/client";

import CollectionPage from "@/src/app/CollectionPage";
import { getPageMetadata } from "@/src/lib/metadata";

const collectionType = CollectionType.SHOPPING;

export const metadata = getPageMetadata({
  title: "Shopping",
});

export default async function ShoppingList({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ create?: string }>;
}) {
  return (
    <CollectionPage collectionType={collectionType} params={params} searchParams={searchParams} />
  );
}
