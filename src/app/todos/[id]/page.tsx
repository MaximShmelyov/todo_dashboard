import { CollectionType } from "@prisma/client";
import CollectionPage from "@/src/app/CollectionPage";
import { getPageMetadata } from "@/src/lib/metadata";

const collectionType = CollectionType.TODO;

export const metadata = getPageMetadata({
  title: "TODO",
});

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
