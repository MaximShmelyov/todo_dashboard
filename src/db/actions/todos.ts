"use server"

import {Collection, CollectionType} from "@prisma/client";
import {createCollection, getCollection, getCollections} from "@/src/db/actions/collections";

const collectionType = CollectionType.TODO;

export async function createTodo(title: string, familyId?: string): Promise<void> {
  return createCollection(title, collectionType, familyId);
}

export async function getTodo(id: string): Promise<Collection> {
  return getCollection(id, collectionType);
}

export async function getTodoList(): Promise<Collection> {
  return getCollections(collectionType);
}