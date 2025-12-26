"use server"

import {Item} from "@prisma/client";
import {prisma} from "@/src/db"
import {getSession} from "@/src/lib/auth";

export async function createItem(
  item: Pick<Item, "title" | "body" | "collectionId" | "createdById" | "dueDate">
) {
  await prisma.item.create({
    data: item
  });
}

export async function deleteItem(id: Item['id']) {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.item.delete({
    where: {
      id,
      OR: [
        {
          AND: [
            {
              createdById: session.user.id,
            },
            // @TODO: check family
          ],
        },
      ],
    },
  });
}

export async function deleteItems(ids: Imte['id'][]) {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.item.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
}