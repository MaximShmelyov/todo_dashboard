"use server";

import { CollectionType } from "@prisma/client";
import { prisma } from "@/src/db";
import { getSession } from "@/src/lib/auth";
import CreateCollectionFormClient from "./CreateCollectionFormClient";

export default async function CreateCollectionForm({
  collectionType,
}: {
  collectionType: CollectionType;
}) {
  const session = await getSession();

  if (!session) return "Loading";

  const families = await prisma.family.findMany({
    where: {
      memberships: {
        some: { userId: session.user.id },
      },
    },
  });

  return <CreateCollectionFormClient collectionType={collectionType} families={families} />;
}
