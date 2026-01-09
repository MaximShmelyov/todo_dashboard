"use server"

import {Item, Prisma} from "@prisma/client";
import {prisma} from "@/src/db"
import {getAuthorId, getFamiliesIds} from "@/src/db/actions/util";

export async function createItem(
  item: Pick<Item, "title" | "body" | "collectionId" | "createdById"> & { dueDate?: Date }
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
          createdById,
        },
        {
          collection: {
            familyId: {
              in: await getFamiliesIds(),
            },
          },
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
      OR: [
        {
          createdById,
        },
        {
          collection: {
            familyId: {
              in: await getFamiliesIds(),
            },
          }
        },
      ],
    },
  });
}

export async function updateItem(
  item: Partial<Pick<Item, "done" | "position" | "body" | "title" | "dueDate">> & {
    metadata?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | undefined
  } & Pick<Item, "id">
) {
  const createdById = await getAuthorId();
  const {id, ...data} = item;

  await prisma.item.update({
    where: {
      id,
      OR: [
        {
          createdById,
        },
        {
          collection: {
            familyId: {
              in: await getFamiliesIds(),
            },
          },
        },
      ],
    },
    data,
  });
}