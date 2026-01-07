"use server"

import {Item, Prisma} from "@prisma/client";
import {prisma} from "@/src/db"
import {getAuthorId} from "@/src/db/actions/util";

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
  const createdById = await getAuthorId();

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

export async function updateItem(
  item: Partial<Pick<Item, "done" | "position" | "body" | "title" | "dueDate">> & {
    metadata?: Prisma.InputJsonValue | null
  } & Pick<Item, "id">
) {
  const createdById = await getAuthorId();
  const {id, ...data} = item;

  await prisma.item.update({
    where: {
      id,
      // @TODO: check family as well
      createdById,
    },
    data,
  });
}