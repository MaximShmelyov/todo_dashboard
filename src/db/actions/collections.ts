"use server"

import {Collection, CollectionType} from "@prisma/client";
import {prisma} from "@/src/db";
import {getSession} from "@/src/lib/auth"

export async function createCollection(title: Collection['title'],
                                       type: CollectionType,
                                       familyId: Collection['familyId']): Promise<void> {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!title) {
    throw new Error("Missing required title field");
  }

  await prisma.collection.create({
    data: {
      title,
      type,
      familyId,
      ownerId: session.user.id,
    },
  })
}

export type CollectionExtended = Awaited<ReturnType<typeof getCollection>>;
export async function getCollection(id: Collection['id'], type: CollectionType) {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return prisma.collection.findFirst({
    where: {
      ownerId: session.user.id,
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
          id: 'desc',
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
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return prisma.collection.findMany({
    where: {
      ownerId: session.user.id,
      type,
    },
    orderBy: {createdAt: "desc"},
    include: {
      family: true,
    },
  });
}

export async function deleteCollection(id: Collection['id']) {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return prisma.collection.deleteMany({
    where: {
      id,
      // @TODO: check family as well
      ownerId: session.user.id,
    },
  });
}