"use server"

import {Item} from "@prisma/client";
import {prisma} from "@/src/db"
import {getSession} from "@/src/lib/auth";

async function getAuthorId() : Promise<string> {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function createItem(
  item: Pick<Item, "title" | "body" | "collectionId" | "createdById" | "dueDate">
) {
  await prisma.item.create({
    data: item
  });
}

export async function deleteItem(id: Item['id']) {
  const createdById = await getAuthorId();

  await prisma.item.delete({
    where: {
      id,
      OR: [
        {
          AND: [
            {
              createdById,
            },
            // @TODO: check family
          ],
        },
      ],
    },
  });
}

export async function deleteItems(ids: Item['id'][]) {
  const createdById = getAuthorId();

  await prisma.item.deleteMany({
    where: {
      id: {
        in: ids,
      },
      // @TODO: check family as well
      createdById,
    },
  });
}

export async function updateItem(item: Partial<Omit<Item, 'id'>> & Pick<Item, 'id'>) {
  const createdById = await getAuthorId();

  await prisma.item.update({
    where: {
      id: item.id,
      // @TODO: check family as well
      createdById,
    },
    data: {
      ...item,
    },
  });
}