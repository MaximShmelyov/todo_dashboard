"use server"

import {Collection, CollectionType} from "@prisma/client";
import {createCollection, getCollection, getCollections} from "@/src/db/actions/collections";

const collectionType = CollectionType.SHOPPING;

export async function createShopping(title: string, familyId?: string): Promise<void> {
  return createCollection(title, collectionType, familyId);
}

export async function getShopping(id: string): Promise<Collection> {
  return getCollection(id, collectionType);
}

export async function getShoppingList(): Promise<Collection> {
  return getCollections(collectionType);
}