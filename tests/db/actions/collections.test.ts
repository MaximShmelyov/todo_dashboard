import { describe, it, expect, beforeEach, vi } from "vitest";

/* ------------------ mocks ------------------ */

vi.mock("@/src/db", () => ({
  prisma: {
    collection: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock("@/src/db/actions/util", () => ({
  getAuthorId: vi.fn(),
  getFamiliesIds: vi.fn(),
}));

/* ------------------ imports ------------------ */

import { prisma } from "@/src/db";
import { getAuthorId, getFamiliesIds } from "@/src/db/actions/util";

import {
  createCollection,
  getCollection,
  getCollections,
  deleteCollection,
} from "@/src/db/actions/collections";
import { Collection, CollectionType } from "@prisma/client";

/* ------------------ tests ------------------ */

describe("collections server actions", () => {
  const ownerId = "user-1";
  const families = ["fam-1", "fam-2"];

  beforeEach(() => {
    vi.mocked(getAuthorId).mockResolvedValue(ownerId);
    vi.mocked(getFamiliesIds).mockResolvedValue(families);
  });

  describe("createCollection", () => {
    it("throws error if title is missing", async () => {
      await expect(createCollection("", CollectionType.NOTE, "fam-1")).rejects.toThrow(
        "Missing required title field",
      );

      expect(prisma.collection.create).not.toHaveBeenCalled();
    });

    it("creates collection with ownerId", async () => {
      vi.mocked(prisma.collection.create).mockResolvedValue({} as Collection);

      await createCollection("My title", CollectionType.NOTE, "fam-1");

      expect(getAuthorId).toHaveBeenCalledOnce();
      expect(prisma.collection.create).toHaveBeenCalledWith({
        data: {
          title: "My title",
          type: CollectionType.NOTE,
          familyId: "fam-1",
          ownerId,
        },
      });
    });
  });

  describe("getCollection", () => {
    it("returns collection if user is owner or family member", async () => {
      const row: Collection = {
        id: "c1",
        createdAt: new Date(),
        title: "Title",
        type: CollectionType.NOTE,
        isPublic: false,
        familyId: null,
        description: null,
        ownerId: null,
        updatedAt: null,
      };
      vi.mocked(prisma.collection.findFirst).mockResolvedValue(row);

      const result = await getCollection("c1", CollectionType.NOTE);

      expect(getAuthorId).toHaveBeenCalledOnce();
      expect(getFamiliesIds).toHaveBeenCalledOnce();

      expect(prisma.collection.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [{ ownerId }, { familyId: { in: families } }],
            id: "c1",
            type: CollectionType.NOTE,
          },
        }),
      );

      expect(result).toBe(row);
    });
  });

  describe("getCollections", () => {
    it("returns collections ordered by createdAt desc", async () => {
      const rows: Collection[] = [
        {
          id: "c1",
          createdAt: new Date(),
          title: "Title",
          type: CollectionType.NOTE,
          isPublic: false,
          familyId: null,
          description: null,
          ownerId: null,
          updatedAt: null,
        },
        {
          id: "c2",
          createdAt: new Date(),
          title: "Title2",
          type: CollectionType.TODO,
          isPublic: false,
          description: null,
          ownerId: null,
          familyId: null,
          updatedAt: null,
        },
      ];
      vi.mocked(prisma.collection.findMany).mockResolvedValue(rows);

      const result = await getCollections(CollectionType.NOTE);

      expect(prisma.collection.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ ownerId }, { familyId: { in: families } }],
          type: CollectionType.NOTE,
        },
        orderBy: { createdAt: "desc" },
        include: { family: true },
      });

      expect(result).toEqual(rows);
    });
  });

  describe("deleteCollection", () => {
    it("deletes collection if allowed", async () => {
      const del = { count: 1 };
      vi.mocked(prisma.collection.deleteMany).mockResolvedValue(del);

      const result = await deleteCollection("c1");

      expect(prisma.collection.deleteMany).toHaveBeenCalledWith({
        where: {
          id: "c1",
          OR: [{ ownerId }, { familyId: { in: families } }],
        },
      });

      expect(result).toBe(del);
    });
  });
});
