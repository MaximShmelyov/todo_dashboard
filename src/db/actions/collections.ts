"use server";

import { Collection, CollectionType } from "@prisma/client";
import { prisma } from "@/src/db";
import { getAuthorId, getFamiliesIds } from "@/src/db/actions/util";

export async function createCollection(
  title: Collection["title"],
  type: CollectionType,
  familyId: Collection["familyId"],
): Promise<void> {
  const ownerId = await getAuthorId();

  if (!title) {
    throw new Error("Missing required title field");
  }

  await prisma.collection.create({
    data: {
      title,
      type,
      familyId,
      ownerId,
    },
  });
}

export type CollectionExtended = Awaited<ReturnType<typeof getCollection>>;

export async function getCollection(id: Collection["id"], type: CollectionType) {
  const ownerId = await getAuthorId();

  return prisma.collection.findFirst({
    where: {
      OR: [
        {
          ownerId,
        },
        {
          familyId: {
            in: await getFamiliesIds(),
          },
        },
      ],
      id,
      type,
    },
    include: {
      items: {
        select: {
          id: true,
          title: true,
          body: true,
          done: true,
          position: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          updatedAt: true,
          dueDate: true,
        },
        orderBy: {
          id: "desc",
        },
      },
      family: {
        select: {
          id: true,
          name: true,
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

export type CollectionsExtended = Awaited<ReturnType<typeof getCollections>>;

export async function getCollections(type: CollectionType) {
  const ownerId = await getAuthorId();

  return await prisma.collection.findMany({
    where: {
      OR: [
        {
          ownerId,
        },
        {
          familyId: {
            in: await getFamiliesIds(),
          },
        },
      ],
      type,
    },
    orderBy: { createdAt: "desc" },
    include: {
      family: true,
    },
  });
}

export async function deleteCollection(id: Collection["id"]) {
  const ownerId = await getAuthorId();

  return prisma.collection.deleteMany({
    where: {
      id,
      OR: [
        {
          ownerId,
        },
        {
          familyId: {
            in: await getFamiliesIds(),
          },
        },
      ],
    },
  });
}
