"use server";

import { prisma } from "@/src/db";
import { $Enums, Family } from "@prisma/client";
import RoleType = $Enums.RoleType;
import { getAuthorId } from "@/src/db/actions/util";

export async function getFamilies() {
  const userId = await getAuthorId();
  return await prisma.family.findMany({
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
}

export type FamilyExtended = Awaited<ReturnType<typeof getFamily>>;

export async function getFamily(id: Family["id"]) {
  return await prisma.family.findUnique({
    where: {
      id,
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
}

export async function updateFamily(
  family: Partial<Omit<Family, "id">> & Required<Pick<Family, "id">>,
) {
  await prisma.family.update({
    where: {
      id: family.id,
    },
    data: {
      ...family,
    },
  });
}

export async function createFamily(name: Family["name"]): Promise<string> {
  const authorId = await getAuthorId();

  return prisma.$transaction(async (transaction) => {
    const createdFamily = await transaction.family.create({
      data: {
        name,
      },
    });

    await transaction.membership.create({
      data: {
        familyId: createdFamily.id,
        userId: authorId,
        roleType: RoleType.ADMIN,
      },
    });

    return createdFamily.id;
  });
}
