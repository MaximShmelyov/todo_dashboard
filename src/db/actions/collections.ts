"use server"

import {Collection, CollectionType} from "@prisma/client";
import {prisma} from "@/src/db";
import {getSession} from "@/src/lib/auth"

export async function createCollection(title: string, type: CollectionType, familyId?: string): Promise<void> {
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


export async function getCollection(id: string, type: CollectionType): Promise<Collection> {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return prisma.collection.findFirst({
    where: {
      ownerId: session.user.id,
      id,
      type,
    }
  });
}

export async function getCollections(type: CollectionType): Promise<Collection[]> {
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