"use server";

import { CollectionType } from "@prisma/client";
import CollectionPage from "@/src/app/CollectionPage";

const collectionType = CollectionType.TODO;

export default async function Todo({
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
