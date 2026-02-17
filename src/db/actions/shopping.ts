"use server";

import { Collection, CollectionType } from "@prisma/client";

import {
  CollectionExtended,
  CollectionsExtended,
  createCollection,
  getCollection,
  getCollections,
} from "@/src/db/actions/collections";

const collectionType = CollectionType.SHOPPING;

export async function createShopping(title: string, familyId: string | null): Promise<void> {
  return createCollection(title, collectionType, familyId);
}

export async function getShopping(id: Collection["id"]): Promise<CollectionExtended> {
  return getCollection(id, collectionType);
}

export async function getShoppingList(): Promise<CollectionsExtended> {
  return getCollections(collectionType);
}
