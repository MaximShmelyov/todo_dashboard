"use server";

import { CollectionType } from "@prisma/client";
import CollectionPage from "@/src/app/CollectionPage";

const collectionType = CollectionType.SHOPPING;

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
