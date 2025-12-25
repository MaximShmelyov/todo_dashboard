import CreateCollectionForm from "@/src/components/common/CreateCollectionForm"
import {CollectionType} from "@prisma/client";
import CollectionsClient from "@/src/app/CollectionsClient";
import {getSession} from "@/src/lib/auth";
import {getTodoList} from "@/src/db/actions/todos";
import PleaseLogIn from "@/src/components/common/PleaseLogIn";

const collectionType: CollectionType = CollectionType.TODO;

export default async function Todos({
                                             searchParams,
                                           }: {
  searchParams: Promise<{ create?: string }>
}) {
  const params = await searchParams;
  const showForm = params.create === "1";
  const session = await getSession();
  if (!session || !session.user) {
    return <PleaseLogIn/>;
  }

  return (
    <>
      <CollectionsClient label="✔️ Todos" collectionType={collectionType} items={await getTodoList()}/>
      {showForm && <CreateCollectionForm collectionType={collectionType} />}
    </>
  )
}
