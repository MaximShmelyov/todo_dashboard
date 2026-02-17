import { CollectionType } from "@prisma/client";

import CollectionsClient from "@/src/app/CollectionsClient";
import CreateCollectionForm from "@/src/components/common/CreateCollectionForm";
import PleaseLogIn from "@/src/components/common/PleaseLogIn";
import { getNoteList } from "@/src/db/actions/notes";
import { getSession } from "@/src/lib/auth";
import { getPageMetadata } from "@/src/lib/metadata";

export const metadata = getPageMetadata({
  title: "Notes",
});

export default async function Notes({
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
        label="📝 Notes"
        collectionType={CollectionType.NOTE}
        items={await getNoteList()}
      />
      {showForm && <CreateCollectionForm collectionType={CollectionType.NOTE} />}
    </>
  );
}
