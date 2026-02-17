"use server";

// import {prisma} from "@/src/db"
import { CollectionType } from "@prisma/client";

import AddItemFormClient from "@/src/components/common/AddItemFormClient";
import { getSession } from "@/src/lib/auth";

export default async function AddItemForm({
  collectionType,
  collectionId,
}: {
  collectionType: CollectionType;
  collectionId: string;
}) {
  const session = await getSession();

  if (!session) throw new Error("empty session");

  return (
    <AddItemFormClient
      collectionType={collectionType}
      collectionId={collectionId}
      ownerId={session.user.id}
    />
  );
}
