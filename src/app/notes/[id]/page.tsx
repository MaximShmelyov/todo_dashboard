import { CollectionType } from "@prisma/client";
import CollectionPage from "@/src/app/CollectionPage";
import { getPageMetadata } from "@/src/lib/metadata";
import { cache } from "react";
import { getFamily } from "@/src/db/actions/family";

const collectionType = CollectionType.NOTE;

export const metadata = getPageMetadata({
  title: "Note",
});

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
