import {Collection, CollectionType} from "@prisma/client";
import {createCollection, getCollection, getCollections} from "@/src/db/actions/collections";

const collectionType = CollectionType.NOTE;

export async function createNote(title: string, familyId?: string): Promise<void> {
  return createCollection(title, collectionType, familyId);
}

export async function getNote(id: string): Promise<Collection> {
  return getCollection(id, collectionType);
}

export async function getNoteList(): Promise<Collection> {
  return getCollections(collectionType);
}