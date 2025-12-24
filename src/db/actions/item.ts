"use server"

import {Item} from "@prisma/client";
import {prisma} from "@/src/db"

export async function createItem(
  item: Pick<Item, "title" | "body" | "collectionId" | "createdById" | "dueDate">
) {
  await prisma.item.create({
    data: item
  });
}