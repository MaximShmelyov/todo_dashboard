import { CollectionType } from "@prisma/client";

import CollectionsClient from "@/src/app/CollectionsClient";
import CreateCollectionForm from "@/src/components/common/CreateCollectionForm";
import PleaseLogIn from "@/src/components/common/PleaseLogIn";
import { getTodoList } from "@/src/db/actions/todos";
import { getSession } from "@/src/lib/auth";
import { getPageMetadata } from "@/src/lib/metadata";

const collectionType: CollectionType = CollectionType.TODO;

export const metadata = getPageMetadata({
  title: "TODOs",
});

export default async function Todos({
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
        label="✔️ Todos"
        collectionType={collectionType}
        items={await getTodoList()}
      />
      {showForm && <CreateCollectionForm collectionType={collectionType} />}
    </>
  );
}
