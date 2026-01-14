"use server";

import { CollectionType } from "@prisma/client";
import CollectionPage from "@/src/app/CollectionPage";

const collectionType = CollectionType.NOTE;

export default async function Note({
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
