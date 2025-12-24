"use server"

// import {prisma} from "@/src/db"
import {getSession} from "@/src/lib/auth"
import AddItemFormClient from "@/src/components/common/AddItemFormClient";
import {CollectionType} from "@prisma/client";

export default async function AddItemForm({
                                            collectionType,
                                            collectionId,
                                          }: {
  collectionType: CollectionType,
  collectionId: string
}) {
  const session = await getSession();

  if (!session) return "Loading";

  return (
    <AddItemFormClient
      collectionType={collectionType}
      collectionId={collectionId}
      ownerId={session.user.id}
    />
  )
}
