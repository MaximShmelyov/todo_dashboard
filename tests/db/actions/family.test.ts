import {describe, it, expect, beforeEach, vi} from "vitest";

/* ------------------ mocks ------------------ */

vi.mock("@/src/db", () => ({
  prisma: {
    family: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("@/src/db/actions/util", () => ({
  getAuthorId: vi.fn(),
}));

/* ------------------ imports ------------------ */

import {prisma} from "@/src/db";
import {getAuthorId} from "@/src/db/actions/util";

import {
  getFamilies,
  getFamily,
  updateFamily,
  createFamily,
} from "@/src/db/actions/family";

import {$Enums, type Family} from "@prisma/client";

/* ------------------ tests ------------------ */

describe("family server actions", () => {
  const userId = "user-1";

  beforeEach(() => {
    vi.mocked(getAuthorId).mockResolvedValue(userId);
  });

  describe("getFamilies", () => {
    it("queries families where user has membership and includes memberships + user fields", async () => {
      const rows: Family[] = [
        {
          id: "f1",
          name: "Family1",
          createdAt: new Date(),
        },
        {
          id: "f2",
          name: "Family2",
          createdAt: new Date(),
        }
      ];
      vi.mocked(prisma.family.findMany).mockResolvedValue(rows);

      const result = await getFamilies();

      expect(getAuthorId).toHaveBeenCalledOnce();
      expect(prisma.family.findMany).toHaveBeenCalledWith({
        where: {
          memberships: {
            some: {
              userId,
            },
          },
        },
        include: {
          memberships: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
              roleType: true,
            },
          },
        },
      });

      expect(result).toBe(rows);
    });
  });

  describe("getFamily", () => {
    it("queries family by id and includes memberships ordered by roleType desc + familyInvite", async () => {
      const row = {id: "f1", name: "Family1", createdAt: new Date()};
      vi.mocked(prisma.family.findUnique).mockResolvedValue(row);

      const result = await getFamily("f1");

      expect(prisma.family.findUnique).toHaveBeenCalledWith({
        where: {id: "f1"},
        include: {
          memberships: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
              roleType: true,
            },
            orderBy: {
              roleType: "desc",
            },
          },
          familyInvite: {
            select: {
              id: true,
              usedBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
              disabled: true,
              roleType: true,
              createdAt: true,
              usedAt: true,
            },
          },
        },
      });

      expect(result).toBe(row);
    });
  });

  describe("updateFamily", () => {
    it("updates family by id with provided fields", async () => {
      vi.mocked(prisma.family.update).mockResolvedValue({id: "f1", name: "Family1", createdAt: new Date()});

      const patch: Partial<Family> & Pick<Family, "id"> = {
        id: "f1",
        name: "New name",
      } as unknown as Partial<Family> & Pick<Family, "id">;

      await updateFamily(patch);

      expect(prisma.family.update).toHaveBeenCalledWith({
        where: {id: "f1"},
        data: {
          ...patch,
        },
      });
    });
  });

  describe("createFamily", () => {
    it("creates family and admin membership inside transaction; returns null (current behavior)", async () => {
      const txFamilyCreate = vi.fn().mockResolvedValue({id: "fam-123"});
      const txMembershipCreate = vi.fn().mockResolvedValue({id: "mem-1"});

      type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
      vi.mocked(prisma.$transaction).mockImplementation(
        async (cb: (tx: Tx) => Promise<unknown>) => {
          const tx = {
            family: {create: txFamilyCreate},
            membership: {create: txMembershipCreate},
          } as unknown as Tx;

          return cb(tx);
        }
      );

      const result = await createFamily("My family");

      expect(getAuthorId).toHaveBeenCalledOnce();
      expect(prisma.$transaction).toHaveBeenCalledOnce();

      expect(txFamilyCreate).toHaveBeenCalledWith({
        data: {
          name: "My family",
        },
      });

      expect(txMembershipCreate).toHaveBeenCalledWith({
        data: {
          familyId: "fam-123",
          userId,
          roleType: $Enums.RoleType.ADMIN,
        },
      });

      expect(result).toBe("fam-123");
    });
  });
});
