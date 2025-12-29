"use server"

import { prisma } from "@/src/db";
import {getSession} from "@/src/lib/auth";
import {Optional} from "@prisma/client/runtime/client";
import {$Enums, Family} from "@prisma/client";
import RoleType = $Enums.RoleType;

async function getAuthorId(): Promise<string> {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

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

export async function updateFamily(family: Optional<Omit<Family, 'id'>> & Required<Pick<Family, 'id'>>) {
  await prisma.family.update({
    where: {
      id: family.id,
    },
    data: {
      ...family,
    },
  });
}

export async function createFamily(name: Family['name']): Promise<string | undefined> {
  const authorId = await getAuthorId();

  await prisma.$transaction(async (transaction) => {
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
    }
  );
  return null;
}