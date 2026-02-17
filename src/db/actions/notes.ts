"use server";

import { Collection, CollectionType } from "@prisma/client";

import {
  CollectionExtended,
  CollectionsExtended,
  createCollection,
  getCollection,
  getCollections,
} from "@/src/db/actions/collections";

const collectionType = CollectionType.NOTE;

export async function createNote(
  title: Collection["title"],
  familyId: Collection["familyId"],
): Promise<void> {
  return createCollection(title, collectionType, familyId);
}

export async function getNote(id: Collection["id"]): Promise<CollectionExtended> {
  return getCollection(id, collectionType);
}

export async function getNoteList(): Promise<CollectionsExtended> {
  return getCollections(collectionType);
}
